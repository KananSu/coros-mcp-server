import { fetchSportStatistic } from "../coros/api/analyse.js";

export async function get_sport_statistic_summary(accessToken: string) {
	const sportStatistic = await fetchSportStatistic(accessToken);
	const distanceKm = (sportStatistic.distance / 1000).toFixed(2);

	const totalHours = Math.floor(sportStatistic.duration / 3600);
	const totalMinutes = Math.floor((sportStatistic.duration % 3600) / 60);
	const remainingSeconds = sportStatistic.duration % 60;
	const durationFormatted = `${totalHours}h ${totalMinutes}m ${remainingSeconds}s`;

	const result = `### Last 4 Weeks Sport Statistics Overview:
- Total Distance: ${distanceKm} km
- Total Duration: ${durationFormatted}
- Total Training Load: ${sportStatistic.trainingLoad} TL
- Average Heart Rate: ${sportStatistic.avgHeartRate || '-'} bpm
- Total Activity Count: ${sportStatistic.count} times
- Average Pace: ${sportStatistic.avgPace || '-'}
`;
	return result;
}