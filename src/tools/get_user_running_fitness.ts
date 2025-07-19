import { fetchUserData } from "../coros/api/account.js";
import { fetchSummaryInfo } from "../coros/api/dashboard.js";

export async function get_user_running_fitness(accessToken: string) {
    const userData = await fetchUserData(accessToken);
    const summaryInfo = await fetchSummaryInfo(accessToken);
    const resultTemplate = `### User Basic Information:
| Age | Gender | Max Heart Rate | Resting Heart Rate | Height | Weight |
|--------|------|--------|--------|--------|--------|
| ${userData.age} | ${userData.sex} | ${userData.maxHeartRate} | ${userData.restingHeartRate} | ${userData.height} | ${userData.weight} |

// ### User Fitness Capability:
// | Running Fitness | Aerobic Endurance | Lactate Threshold | Speed Endurance | Sprint Endurance | Recovery Percentage | Max Heart Rate | Full Recovery Hours | Lactate Threshold HR | HR Zone | Lactate Threshold Pace | Pace Zone |
// |--------|------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
// | ${summaryInfo.staminaLevel} | ${summaryInfo.aerobicEnduranceScore} | ${summaryInfo.lactateThresholdCapacityScore} | ${summaryInfo.anaerobicEnduranceScore} | ${summaryInfo.anaerobicCapacityScore} | ${summaryInfo.recoveryPct} | ${summaryInfo.fitnessMaxHr} | ${summaryInfo.fullRecoveryHours} | ${summaryInfo.lthr} | ${JSON.stringify(summaryInfo.lthrZone)} | ${summaryInfo.ltsp} | ${JSON.stringify(summaryInfo.ltspZone)} |
`
  return resultTemplate;
}

