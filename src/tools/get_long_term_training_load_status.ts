import { fetchTracingStatus } from "../coros/api/analyse.js";

export async function get_long_term_training_load_status(accessToken: string) {
	const tracingStatus = await fetchTracingStatus(accessToken);
	if (!tracingStatus || tracingStatus.length === 0) {
		return "### Last 12 Weeks Training Load Status\n\nSorry, could not retrieve your training load status data.";
	}
	let result = "### Last 12 Weeks Training Load Status:\n\n";
	result += `| Date | Long-term Load (CTL) | Short-term Load (ATL) | Load Ratio (ATL/CTL) |\n`;
	result += `|------|----------------|----------------|------------------|\n`;
	tracingStatus.forEach(day => {
		const loadRatioFormatted = day.radio !== undefined ? day.radio.toFixed(2) : '-'; // Format load ratio to two decimal places
		result += `| ${day.date} ` +
			`| ${day.baseFitness !== undefined ? day.baseFitness : '-'} ` +
			`| ${day.loadImpact !== undefined ? day.loadImpact : '-'} ` +
			`| ${loadRatioFormatted} |\n`;
	});
	return result;
}