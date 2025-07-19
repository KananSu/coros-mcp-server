import { fetchSportDataList } from "../coros/api/dashboard.js";

export async function get_current_week_activity_record(accessToken: string) {
  const currentWeekRecord = await fetchSportDataList(accessToken);
  const result = `
### Weekly Activity Record
| Metric | Target | Actual |
|------|------|--------|
| Distance (m) | ${currentWeekRecord.distanceRecord.totalTarget} | ${currentWeekRecord.distanceRecord.totalValue} |
| Duration (sec) | ${currentWeekRecord.durationRecord.totalTarget} | ${currentWeekRecord.durationRecord.totalValue} |
| Training Load | ${currentWeekRecord.tlRecord.totalTarget} | ${currentWeekRecord.tlRecord.totalValue} |

### Recent Activity Details
| Date | Distance (m) | Duration (sec) | Training Load | Average Pace (min:sec) |
|------|----------|----------|----------|----------------|
${currentWeekRecord.sportDataDetail.map(item => `| ${item.date} | ${item.distance} | ${item.duration} | ${item.trainingLoad} | ${item.avgPace} |`).join('\n')}
    `
  return result;
}