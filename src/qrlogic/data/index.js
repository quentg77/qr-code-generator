export const alignmentData = {
	"V1": [],
	"V2": [6, 18],
	"V3": [6, 22],
	"V4": [6, 26],
	"V5": [6, 30],
	"V6": [6, 34],
	"V7": [6, 22, 38],
	"V8": [6, 24, 42],
	"V9": [6, 26, 46],
	"V10": [6, 28, 50],
	"V11": [6, 30, 54],
	"V12": [6, 32, 58],
	"V13": [6, 34, 62],
	"V14": [6, 26, 46, 66],
	"V15": [6, 26, 48, 70],
	"V16": [6, 26, 50, 74],
	"V17": [6, 30, 54, 78],
	"V18": [6, 30, 56, 82],
	"V19": [6, 30, 58, 86],
	"V20": [6, 34, 62, 90],
};

export const formatInformationData = {
	"L": {
		"0": "111011111000100",
		"1": "111001011110011",
		"2": "111110110101010",
		"3": "111100010011101",
		"4": "110011000101111",
		"5": "110001100011000",
		"6": "110110001000001",
		"7": "110100101110110",
	},
	"M": {
		"0": "101010000010010",
		"1": "101000100100101",
		"2": "101111001111100",
		"3": "101101101001011",
		"4": "100010111111001",
		"5": "100000011001110",
		"6": "100111110010111",
		"7": "100101010100000",
	},
	"Q": {
		"0": "011010101011111",
		"1": "011000001101000",
		"2": "011111100110001",
		"3": "011101000000110",
		"4": "010010010110100",
		"5": "010000110000011",
		"6": "010111011011010",
		"7": "010101111101101",
	},
	"H": {
		"0": "001011010001001",
		"1": "001001110111110",
		"2": "001110011100111",
		"3": "001100111010000",
		"4": "000011101100010",
		"5": "000001001010101",
		"6": "000110100001100",
		"7": "000100000111011",
	},
};

export const maxCapacityData = {
	"1": {
		"L": [41, 25, 17, 10],
		"M": [34, 20, 14, 8],
		"Q": [27, 16, 11, 7],
		"H": [17, 10, 7, 4],
	},
	"2": {
		"L": [77, 47, 32, 20],
		"M": [63, 38, 26, 16],
		"Q": [48, 29, 20, 8],
		"H": [34, 20, 14, 8],
	},
};

export const ECCodeWord = {
	"1": {
		"L": {
			"totalNbOfData": 19,
			"ECCodewordsPerBlock": 7,
			"Grp1": [1,19],
			"Grp2": [0,0],
		},
		"M": {
			"totalNbOfData": 16,
			"ECCodewordsPerBlock": 10,
			"Grp1": [1,16],
			"Grp2": [0,0],
		},
		"Q": {
			"totalNbOfData": 13,
			"ECCodewordsPerBlock": 13,
			"Grp1": [1,13],
			"Grp2": [0,0],
		},
		"H": {
			"totalNbOfData": 9,
			"ECCodewordsPerBlock": 17,
			"Grp1": [1,9],
			"Grp2": [0,0],
		},
	},
	"2": {
		"L": {
			"totalNbOfData": 34,
			"ECCodewordsPerBlock": 10,
			"Grp1": [1,34],
			"Grp2": [0,0],
		},
		"M": {
			"totalNbOfData": 28,
			"ECCodewordsPerBlock": 16,
			"Grp1": [1,28],
			"Grp2": [0,0],
		},
		"Q": {
			"totalNbOfData": 22,
			"ECCodewordsPerBlock": 22,
			"Grp1": [1,22],
			"Grp2": [0,0],
		},
		"H": {
			"totalNbOfData": 16,
			"ECCodewordsPerBlock": 28,
			"Grp1": [1,16],
			"Grp2": [0,0],
		},
	},
	"3": {
		"L": {
			"totalNbOfData": 55,
			"ECCodewordsPerBlock": 15,
			"Grp1": [1,55],
			"Grp2": [0,0],
		},
		"M": {
			"totalNbOfData": 44,
			"ECCodewordsPerBlock": 26,
			"Grp1": [1,44],
			"Grp2": [0,0],
		},
		"Q": {
			"totalNbOfData": 34,
			"ECCodewordsPerBlock": 18,
			"Grp1": [2,17],
			"Grp2": [0,0],
		},
		"H": {
			"totalNbOfData": 26,
			"ECCodewordsPerBlock": 22,
			"Grp1": [2,13],
			"Grp2": [0,0],
		},
	},
	"4": {
		"L": {
			"totalNbOfData": 80,
			"ECCodewordsPerBlock": 20,
			"Grp1": [1,80],
			"Grp2": [0,0],
		},
		"M": {
			"totalNbOfData": 64,
			"ECCodewordsPerBlock": 18,
			"Grp1": [2,32],
			"Grp2": [0,0],
		},
		"Q": {
			"totalNbOfData": 48,
			"ECCodewordsPerBlock": 26,
			"Grp1": [2,24],
			"Grp2": [0,0],
		},
		"H": {
			"totalNbOfData": 36,
			"ECCodewordsPerBlock": 16,
			"Grp1": [4,9],
			"Grp2": [0,0],
		},
	},
};

export const GF256Antilogs = [1,2,4,8,16,32,64,128,29,58,116,232,205,135,19,38,76,152,45,90,180,117,234,201,143,3,6,12,24,48,96,192,157,39,78,156,37,74,148,53,106,212,181,119,238,193,159,35,70,140,5,10,20,40,80,160,93,186,105,210,185,111,222,161,95,190,97,194,153,47,94,188,101,202,137,15,30,60,120,240,253,231,211,187,107,214,177,127,254,225,223,163,91,182,113,226,217,175,67,134,17,34,68,136,13,26,52,104,208,189,103,206,129,31,62,124,248,237,199,147,59,118,236,197,151,51,102,204,133,23,46,92,184,109,218,169,79,158,33,66,132,21,42,84,168,77,154,41,82,164,85,170,73,146,57,114,228,213,183,115,230,209,191,99,198,145,63,126,252,229,215,179,123,246,241,255,227,219,171,75,150,49,98,196,149,55,110,220,165,87,174,65,130,25,50,100,200,141,7,14,28,56,112,224,221,167,83,166,81,162,89,178,121,242,249,239,195,155,43,86,172,69,138,9,18,36,72,144,61,122,244,245,247,243,251,235,203,139,11,22,44,88,176,125,250,233,207,131,27,54,108,216,173,71,142,1];
