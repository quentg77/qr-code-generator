import { GF256Antilogs } from "../data";

export class ReedSolomon {
	static encode(message = "", size = 13) {
		let data = {
			nb: [],
			x: []
		};

		// init data and convert to int
		for (let i = 0; i < Math.floor(message.length / 8); i++) {
			data.nb.push(parseInt(message.slice(i * 8, i * 8 + 8), 2));
			data.x.unshift(i);
		}

		data.x = data.x.map(x => x + size);

		let gp = GeneratorPolinamial.get(size);

		gp.x = gp.x.map(x => x + data.x[0] - size);

		console.log(gp);

		for (let i = 0; i < Math.floor(message.length / 8); i++) {
			console.log("index: ", i);

			if (data.nb[0]) {
				let alpha = GaloisFeild.log(data.nb[0]);
	
				let lastnbs = data.nb;
				
				data.nb = GaloisFeild.antilogAll(GaloisFeild.mulAllExpByAlpha(gp.alpha, alpha));
				
				let res = []
				for (let j = 0; j < (lastnbs.length >= size + 1 ? lastnbs.length : size + 1); j++) {
					res.push(data.nb[j] ^ (lastnbs[j] ? lastnbs[j] : 0));
				}
				
				res.shift();
				data.nb = res;
				data.x = data.x.map(x => x - 1);
				
				console.log("res by step: ", data.nb);
			}
			else {
				data.nb.shift();
				data.x = data.x.map(x => x - 1);
				console.log("Discard remaining lead 0 term");
				console.log("res by step: ", data.nb);
			}
		}

		return nbListToBitString(data.nb);
	}
}

class GeneratorPolinamial {
	static get(size = 13) {
		let generator = {
			alpha: [0, 0],
			x: [1, 0]
		};

		for (let i = 1; i < size; i++) {
			let step = {
				alpha: [0, i],
				x: [1, 0]
			};

			let multiply = {
				alpha: [],
				x: []
			};

			// multiply generator and step exponent
			for (let s = 0; s < 2; s++) {
				for (let g = 0; g < generator.alpha.length; g++) {
					const alphaExp = this.mulExp(generator.alpha[g], step.alpha[s]);
					const xExp = generator.x[g] + step.x[s];

					multiply.alpha.push(alphaExp);
					multiply.x.push(xExp);
				}
			}

			generator = {
				alpha: [],
				x: []
			};

			for (let m = 0; m < multiply.x.length; m++) {
				let alphaExp = multiply.alpha[m];
				const xExp = multiply.x[m];

				if (generator.x.indexOf(xExp) >= 0) {
					const index = generator.x.indexOf(xExp);

					alphaExp = GaloisFeild.xorAlpha(multiply.alpha[m], generator.alpha[index]);

					generator.alpha[index] = alphaExp;
				}
				else {
					generator.alpha.push(alphaExp);
					generator.x.push(xExp);
				}
			}
		}

		return generator;
	}

	static mulExp(exp1, exp2) {
		const expRes = exp1 + exp2;
		return (expRes % 256) + Math.floor(expRes / 256);
	}
}

class GaloisFeild {
	static log(nb) {
		return GF256Antilogs.indexOf(nb);
	}

	static antilog(nb) {
		return GF256Antilogs[nb];
	}

	static antilogAll(nbs) {
		return nbs.map(x => this.antilog(x));
	}

	static mulExp(exp1, exp2) {
		return ((exp1 + exp2) % 255);
	}

	static mulAllExpByAlpha(alphas, exp) {
		return alphas.map(x => this.mulExp(x, exp));
	}

	static xorAlpha(a1, a2) {
		const i1 = this.antilog(a1);
		const i2 = this.antilog(a2);
		return this.log(i1 ^ i2);
	}
}

function nbListToBitString(nbList) {
	const pad = 8;
	const padString = new Array(pad).join("0");
	let resList = [];

	nbList.forEach(value => {
		resList.push((padString + value.toString(2)).slice(pad * -1));
	});

	return resList.join("");
}