import { finderPattern, alignmentPattern } from "./pattern";
import { alignmentData, formatInformationData, ECCodeWord } from "./data";
import { ReedSolomon } from "./algorithm/reedSolomonErrorCorrection"

const quietZone = 5;
const debug = false;

let qrcodeResult = {}

//#region reserved data
function writePattern(pattern, posX, posY, separator = false) {
	// apply pattern
	for (let y = 0 + posY; y < pattern.sizeY + posY; y++) {
		for (let x = 0 + posX; x < pattern.sizeX + posX; x++) {
			const key = x + "-" + y;
			const patternKey = (x - posX) + "-" + (y - posY);

			qrcodeResult[key] = {
				value: pattern[patternKey],
				reserved: true
			}
		}
	}

	// add white separator to finder
	if (separator) {
		for (let y = -1 + posY; y < pattern.sizeY + posY + 1; y++) {
			for (let x = -1 + posX; x < pattern.sizeX + posX + 1; x++) {
				if (
					(
						(y === posY - 1 || y === posY + 1 + 6) ||
						(x === posX - 1 || x === posX + 1 + 6)
					) && !(
						(x < 0 + quietZone || x > (qrcodeResult.size - 1) - quietZone) ||
						(y < 0 + quietZone || y > (qrcodeResult.size - 1) - quietZone)
					)
				) {
					const key = x + "-" + y;

					qrcodeResult[key] = {
						value: 0,
						reserved: true
					}
				}
			}
		}
	}
}

function writeTimer() {
	// horizontal line
	for (let x = 8; x < qrcodeResult.size - (quietZone * 2) - 7; x++) {
		let key = (x + quietZone) + "-" + (6 + quietZone);

		if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
			if (!(x % 2)) {
				qrcodeResult[key] = {
					value: 1,
					reserved: true
				}
			}
			else {
				qrcodeResult[key] = {
					value: 0,
					reserved: true
				}
			}
		}
	}

	// vertical line
	for (let y = 8; y < qrcodeResult.size - (quietZone * 2) - 7; y++) {
		let key = (6 + quietZone) + "-" + (y + quietZone);

		if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
			if (!(y % 2)) {
				qrcodeResult[key] = {
					value: 1,
					reserved: true
				}
			}
			else {
				qrcodeResult[key] = {
					value: 0,
					reserved: true
				}
			}
		}
	}
}

function writeAlignment() {
	const data = alignmentData[qrcodeResult.version];
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data.length; j++) {
			const posX = data[j],
				posY = data[i];

			const key = (posX + quietZone) + "-" + (posY + quietZone); // +1 for quiet zone

			if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
				writePattern(alignmentPattern, posX - 2 + quietZone, posY - 2 + quietZone) // -2 to center alignment (center - floor(alignmentSize/2))
			}
		}
	}
}

function writeDarkModule() {
	const key = (quietZone + 8) + "-" + (qrcodeResult.size - (quietZone + 8));
	qrcodeResult[key] = {
		value: 1,
		reserved: true
	}
}

function writeFormatInfo() {
	const formatInfo = getFormatInformation(qrcodeResult.ECC, qrcodeResult.mask);

	let index = 0;

	// for x axis
	for (let x = 0 + quietZone; x < qrcodeResult.size - quietZone; x++) {
		const key = x + "-" + (8 + quietZone);

		if (x < 6 + quietZone) {

			qrcodeResult[key] = {
				value: parseInt(formatInfo[index]),
				reserved: true
			}

			index++;
		}
		else if (x > 6 + quietZone && x < 8 + quietZone) {
			qrcodeResult[key] = {
				value: parseInt(formatInfo[index]),
				reserved: true
			}

			index++;
		}
		else if (x === qrcodeResult.size - quietZone - 9) {
			// index--;
		}
		else if (x > qrcodeResult.size - quietZone - 9) {
			qrcodeResult[key] = {
				value: parseInt(formatInfo[index]),
				reserved: true
			}

			index++;
		}
	}

	const reverseFormatInfo = formatInfo.split("").reverse().join("");

	index = 0;

	// for y axis
	for (let y = 0 + quietZone; y < qrcodeResult.size - quietZone; y++) {
		const key = (8 + quietZone) + "-" + y;

		if (y < 6 + quietZone) {

			qrcodeResult[key] = {
				value: parseInt(reverseFormatInfo[index]),
				reserved: true
			}

			index++;
		}
		else if (y > 6 + quietZone && y < 9 + quietZone) {
			qrcodeResult[key] = {
				value: parseInt(reverseFormatInfo[index]),
				reserved: true
			}

			index++;
		}
		else if (y > qrcodeResult.size - quietZone - 8) {
			qrcodeResult[key] = {
				value: parseInt(reverseFormatInfo[index]),
				reserved: true
			}

			index++;
		}
	}
}
//#endregion

function writeData() {

	const bitEncoding = getBitOf(qrcodeResult.encoding, 4);
	const bitLength = getBitOf(qrcodeResult.message.length);
	const bitMessage = getBitOf(qrcodeResult.message);
	let testmsgInt = []

	let finalData = addMissingZero(bitEncoding + bitLength + bitMessage + "0000");
	
	console.log(finalData)
	
	finalData = fillToMax(finalData)
	
	for (let i = 0; i < Math.floor(finalData.length / 8); i++) {
		testmsgInt.push(parseInt(finalData.slice(i * 8, i * 8 + 8), 2));
	}

	console.log(testmsgInt.join(","));
	
	console.log(finalData)

	finalData += ReedSolomon.encode(finalData, ECCodeWord[qrcodeResult.version.slice(1)][qrcodeResult.ECC].ECCodewordsPerBlock);

	console.log(finalData)

	console.log("taille du message final: ", (finalData.length / 8))
	for (let x = qrcodeResult.size - 1 - quietZone; x > quietZone; x--) {
		if (x > 6 + quietZone) { // write before the exception column
			if ((x - quietZone) % 2 === 0 && (x - quietZone) % 4 === 0) { // up data
				for (let y = qrcodeResult.size - 1 - quietZone; y >= quietZone; y--) {
					let key = x + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 2
						}

						finalData = finalData.substr(1);
					}

					key = (x - 1) + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 4
						}

						finalData = finalData.substr(1);
					}
				}
			}
			else if ((x - quietZone) % 2 === 0 && (x - quietZone) % 4 === 2) { // down data
				for (let y = 0 + quietZone; y <= qrcodeResult.size - 1 - quietZone; y++) {
					let key = x + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 3
						}

						finalData = finalData.substr(1);
					}

					key = (x - 1) + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 4
						}

						finalData = finalData.substr(1);
					}
				}
			}
		}
		else if (x < 6 + quietZone) { // write after the exception column
			if ((x - quietZone) % 2 === 1 && (x - quietZone) % 4 === 3) { // up data, 3 intead of 1 because need to invert
				for (let y = qrcodeResult.size - 1 - quietZone; y >= quietZone; y--) {
					let key = x + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 2
						}

						finalData = finalData.substr(1);
					}

					key = (x - 1) + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 4
						}

						finalData = finalData.substr(1);
					}
				}
			}
			else if ((x - quietZone) % 2 === 1 && (x - quietZone) % 4 === 1) { // down data
				for (let y = 0 + quietZone; y <= qrcodeResult.size - 1 - quietZone; y++) {
					let key = x + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 3
						}

						finalData = finalData.substr(1);
					}

					key = (x - 1) + "-" + y;

					if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
						qrcodeResult[key] = {
							value: parseInt(finalData.slice(0, 1)) || 4
						}

						finalData = finalData.substr(1);
					}
				}
			}
		}
	}
}

function addMissingZero(message) {
	const missingZero = message.length % 8;
	return message + new Array(missingZero + 1).join("0");
}

function fillToMax(message) {
	const versionNumber = qrcodeResult.version.substring(1);

	const extra1 = "11101100",
		extra2 = "00010001";

	// let index = 0;
	// switch (qrcodeResult.encoding) {
	// 	case 1:
	// 		index = 0;
	// 		break;
	// 	case 2:
	// 		index = 1;
	// 		break;
	// 	case 4:
	// 		index = 2;
	// 		break;
	// 	case 8:
	// 		index = 3;
	// 		break;
	// 	default:
	// 		break;
	// }

	const remainingByte = (ECCodeWord[versionNumber][qrcodeResult.ECC].totalNbOfData * 8) - message.length;
	console.log(remainingByte / 8);

	for (let i = 0; i < Math.floor(remainingByte / 8); i++) {
		if (i % 2 === 0) {
			message += extra1;
		}
		else {
			message += extra2;
		}
	}

	return message;
}

function applyMask() {
	for (let y = 0; y < qrcodeResult.size - (quietZone * 2); y++) {
		for (let x = 0; x < qrcodeResult.size - (quietZone * 2); x++) {
			let masked = false;

			switch (qrcodeResult.mask) {
				case 0:
					if ((y + x) % 2 === 0) {
						masked = true;
					}
					break;
				case 1:
					if (y % 2 === 0) {
						masked = true;
					}
					break;
				case 2:
					if (x % 3 === 0) {
						masked = true;
					}
					break;
				case 3:
					if ((y + x) % 3 === 0) {
						masked = true;
					}
					break;
				case 4:
					if ((Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0) {
						masked = true;
					}
					break;
				case 5:
					if (((y * x) % 2) + ((y * x) % 3) === 0) {
						masked = true;
					}
					break;
				case 6:
					if ((((y * x) % 2) + ((y * x) % 3)) % 2 === 0) {
						masked = true;
					}
					break;
				case 7:
					if ((((y + x) % 2) + ((y * x) % 3)) % 2 === 0) {
						masked = true;
					}
					break;
				default:
					break;
			}

			if (masked) {
				let key = (x + quietZone) + "-" + (y + quietZone);

				if (!(qrcodeResult[key] && qrcodeResult[key].reserved)) {
					qrcodeResult[key] = {
						value: qrcodeResult[key] && qrcodeResult[key].value === 1 ? 0 : 1
					}
				}
			}
		}
	}
}

function writeBasic() {
	writePattern(finderPattern, quietZone, quietZone, true); // start at 1 because my schema is 7x7
	writePattern(finderPattern, quietZone, quietZone + qrcodeResult.size - 7 - (quietZone * 2), true); // -2 for quiet zone and -7 for the size of finder
	writePattern(finderPattern, quietZone + qrcodeResult.size - 7 - (quietZone * 2), quietZone, true);

	writeAlignment();

	writeTimer();

	writeDarkModule();

	writeFormatInfo();

	writeData();

	applyMask();
}

function draw() {
	let text = "";
	for (let y = 0; y < qrcodeResult.size; y++) {
		let line = "";
		for (let x = 0; x < qrcodeResult.size; x++) {
			const key = x + "-" + y;
			let value = -1;

			if (qrcodeResult[key] && typeof qrcodeResult[key].value === "number") {
				value = qrcodeResult[key].value;
			}

			if (value === 1) {
				line += "██";
			}
			else if (value === 0 || !debug) {
				line += "  "
			}
			else if (value === 2) {
				line += "^^";
			}
			else if (value === 3) {
				line += "vv";
			}
			else if (value === 4) {
				line += "||";
			}
			else {
				line += "::";
			}
		}
		text += line + "\r\n";
	}
	console.log(text);
}

//#region get function
function getQRSize(version) {
	return 21 + parseInt((version.slice(1) - 1) * 4);
}

function getFormatInformation(ECC, mask) {
	return formatInformationData[ECC][mask];
}

function getBitOf(value, pad = 8) {
	let resList = [];
	const padString = new Array(pad).join("0");

	if (typeof value === "number") {
		resList.push((padString + value.toString(2)).slice(pad * -1));
	}
	else if (typeof value === "string") {
		for (const char of value) {
			resList.push((padString + char.charCodeAt(0).toString(2)).slice(pad * -1));
		}
	}

	return resList.join("");
}
//#endregion

class QRcode {
	static create({ value, encoding }) {
		console.log("create a qrcode from '" + value + "' with encoding " + encoding);

		qrcodeResult.message = value || "no message";
		qrcodeResult.encoding = encoding;
		qrcodeResult.version = "V2";

		qrcodeResult.size = getQRSize(qrcodeResult.version) + (quietZone * 2); // *2 = 1 per side per axis

		qrcodeResult.mask = 3;
		qrcodeResult.ECC = "H";

		console.log(qrcodeResult);

		writeBasic()
		// console.log(getBitOf(12,4));
		// console.log(getBitOf(qrcodeResult.message));
		draw()
		console.log(qrcodeResult);

	}
}

export default QRcode;