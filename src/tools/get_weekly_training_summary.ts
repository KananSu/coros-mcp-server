import { fetchActiveRecord } from "../coros/api/analyse.js";
import { formatDate } from "../coros/utils/utils.js";

export async function get_weekly_training_summary(accessToken: string) {
	const activeRecords = await fetchActiveRecord(accessToken);
	if (!activeRecords || activeRecords.length === 0) {
		return '### Last 4 Weeks Weekly Training Summary\n\nSorry, could not retrieve your weekly training summary data.';
	}
	let result = "### Last 4 Weeks Weekly Training Summary:\n\n";
	result += `| Week Period | Distance (Actual/Target km) | Duration (Actual/Target) | Training Load (Actual/Target) |\n`;
	result += `|--------|--------------------|-----------------|-----------------|\n`;
	activeRecords.forEach(week => {
		const startDayFormatted = formatDate(week.firstDayOfWeek);
		const endDayFormatted = formatDate(week.lastDayInWeek);
		const distanceActualKm = (week.actualDistance / 1000).toFixed(2);
		const distanceTargetKm = (week.targetDistance / 1000).toFixed(2);
		const trainingLoadActual = week.actualTrainingLoad !== undefined ? week.actualTrainingLoad : '-';
		const trainingLoadTarget = week.targetTrainingLoad !== undefined ? week.targetTrainingLoad : '-';
		result += `| ${startDayFormatted} - ${endDayFormatted} ` +
			`| ${distanceActualKm}/${distanceTargetKm} ` +
			`| ${week.actualActiveTime || '-'}/${week.targetActiveTime || '-'} ` +
			`| ${trainingLoadActual}/${trainingLoadTarget} |\n`;
	});
	return result;
}