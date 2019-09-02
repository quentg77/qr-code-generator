import React from 'react';
import './App.css';
import { Box, Button, FormControl, Select, MenuItem, InputLabel, OutlinedInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import qrcode from "./qrlogic";

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200,
	},
	menuItem: {
		color: "black",
		"&:hover": {
			color: "green",
		}
	},
	select: {
		color: "white",
	},
	cssOutlinedInput: {
		borderColor: "white",
		// backgroundColor: "white",
	}
}));

function App(props) {

	const classes = useStyles(props);
	const [values, setValues] = React.useState({
		typeCode: 4,
		inputText: "",
	});

	const inputLabel = React.useRef(null);
	const [labelWidth, setLabelWidth] = React.useState(0);
	React.useEffect(() => {
		setLabelWidth(inputLabel.current.offsetWidth);
	}, []);

	function handleChange(event) {
		event.persist() // regle des problemes magique
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	function bpClick() {
		console.log("click");
		qrcode.create({ value: values.inputText, encoding: values.typeCode });
	}

	return (
		<Box className="mainPage" >
			<h1>Enter your text</h1>
			<Box className="box-input-area" >
				<textarea id="inputTextz" name="inputText" spellCheck="false" maxLength={1000}
					value={values.inputText}
					onChange={handleChange}
				/>
			</Box>
			<Box m={2} className="box-button-area">
				<FormControl className={classes.formControl} m={1} variant="outlined">
					<InputLabel ref={inputLabel} htmlFor="outlined-typeCode-simple">Encoding</InputLabel>
					<Select className={classes.select}
						value={values.typeCode}
						onChange={handleChange}
						input={
							<OutlinedInput
								labelWidth={labelWidth}
								name="typeCode"
								id="outlined-typeCode-simple"
							/>
						}
					>
						<MenuItem classes={{ root: classes.menuItem }} value={1}>Number</MenuItem>
						<MenuItem classes={{ root: classes.menuItem }} value={2}>Alphanumeric</MenuItem>
						<MenuItem classes={{ root: classes.menuItem }} value={4}>Byte</MenuItem>
					</Select>
				</FormControl>
				<Button variant="contained" color="primary" onClick={bpClick} >Convert</Button>
			</Box>
		</Box>
	);
}

export default App;
