import { ActivityLapItemList, fetchLatestActivity } from "../coros/api/activity.js";

export async function get_latest_activity_record(accessToken: string, size?: number) {
	const latestRecord = await fetchLatestActivity(accessToken, size ?? 1);
	// Check if there is data
	if (!latestRecord || latestRecord.length === 0) {
		return '### Recent Activity Records\n\nSorry, no recent activity records could be retrieved.';
	}
	// Build table header
	const header = `
### Recent ${latestRecord.length} Activity Records
| Date | Sport Type | Name | Distance (km) | Total Duration | Average Pace | Adjusted Pace | Best Pace | Average HR | Average Cadence | Average Power | Training Load | Calories | Ascent (m) | Descent (m) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
`;

	const lapItem:ActivityLapItemList[][] = [];
	const rows = latestRecord.map(item => {
		const activityDateFormatted = item.date;
		const distanceKm = (item.distance / 1000).toFixed(2);
		const totalMinutes = Math.floor(item.totalTime / 60);
		const remainingSeconds = item.totalTime % 60;
		const durationFormatted = `${totalMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
		const formatValue = (value: number | string | undefined) => {
			if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
				return '-';
			}
			return value.toString();
		};
		if (item.lapItem && item.lapItem.length > 0) {
			lapItem.push(item.lapItem);
		}

		return `| ${activityDateFormatted} ` +
			`| ${formatValue(item.sportTypeName)} ` +
			`| ${formatValue(item.name)} ` +
			`| ${distanceKm} ` +
			`| ${durationFormatted} ` +
			`| ${formatValue(item.avgSpeed)} ` +
			`| ${formatValue(item.adjustedPace)} ` +
			`| ${formatValue(item.bestPace)} ` +
			`| ${formatValue(item.avgHr)} ` +
			`| ${formatValue(item.avgCadence)} ` +
			`| ${formatValue(item.avgPower)} ` +
			`| ${formatValue(item.trainingLoad)} ` +
			`| ${formatValue(item.calorie)} ` +
			`| ${formatValue(item.ascent)} ` +
			`| ${formatValue(item.descent)}|`;
	}).join('\n');

	const lapResult = lapItem.map((item, index) => {
		const lapHeader = `### Detailed Information for Each Kilometer of the ${index}th Acticity Record:\n\n
| Lap | Distance (km) | Pace | Avg HR | Avg Cadence | Avg Power | Avg Step Length (cm) |\n|---|---|---|---|---|---|---|
`;
		const lapRows = item.map(lap => {
			return `| ${lap.lapIndex} | ${lap.distance} | ${lap.avgPace} | ${lap.avgHr} | ${lap.avgCadence} | ${lap.avgPower} | ${lap.avgStrideLength} |`;
		}).join('\n');
		return `${lapHeader}\n${lapRows}\n`;
	});

	const result = header + rows + lapResult;
	return result;
}