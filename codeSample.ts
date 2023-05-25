import { PythonShell } from 'python-shell';

export const performAnalysis = async (
	financialData: string,
	stockPrice: number,
	sharesOutstanding: number
) => {
	// Convert the financial data to a pandas DataFrame
	const pythonShell = new PythonShell('convert_to_dataframe.py');
	pythonShell.send(financialData);
	const [dataframeJson]: any = await pythonShell.on(
		'message',
		(message) => message
	);
	const dataframe = JSON.parse(dataframeJson);

	// Perform financial analysis using pandas and numpy
	const revenues = dataframe['Revenues'];
	const expenses = dataframe['Operating Expenses'];
	const netIncome = revenues - expenses;
	const grossMargin = (revenues - expenses) / revenues;
	const ebitda = dataframe['EBITDA'];
	const earningsPerShare = netIncome / sharesOutstanding;
	const peRatio = stockPrice / earningsPerShare;

	// Format the analysis results
	const analysisResults = {
		revenues: revenues.toFixed(2),
		expenses: expenses.toFixed(2),
		netIncome: netIncome.toFixed(2),
		grossMargin: (grossMargin * 100).toFixed(2),
		ebitda: ebitda.toFixed(2),
		earningsPerShare: earningsPerShare.toFixed(2),
		peRatio: peRatio.toFixed(2),
	};

	return analysisResults;
};
