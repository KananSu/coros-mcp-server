import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { fetchUserData, getAccessToken } from './coros/api/account.js';
import { fetchSportDataList, fetchSummaryInfo } from './coros/api/dashboard.js';
import z from 'zod';
import { fetchLatestActivity } from './coros/api/activity.js';
import { fetchActiveRecord, fetchDistribution, fetchSportStatistic, fetchTracingStatus } from './coros/api/analyse.js';
import { formatDate } from './coros/utils/utils.js';
import { Distribution } from './coros/utils/type.js';

async function runServer() {
  const accessToken = await getAccessToken();
  const server = new McpServer({
    name: "coros-mcp-server",
    version: '0.0.1',
  });

  server.tool('get_user_running_fitness', 'get user running fitness info', {}, async () => {
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
    return {
      content: [{ type: "text", text: resultTemplate }]
    };
  });

  server.tool('get_current_week_activity_record', 'get current week activity record', {}, async () => {
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
    return {
      content: [{ type: "text", text: result }]
    };
  });


  server.tool('get_latest_activity_record', 'get latest activity record', {
    size: z.number().optional(),
  }, async ({ size }) => {
    const latestRecord = await fetchLatestActivity(accessToken, size ?? 10);
    // Check if there is data
    if (!latestRecord || latestRecord.length === 0) {
      return {
        content: [{ type: "text", text: "### Recent Activity Records\n\nSorry, no recent activity records could be retrieved." }]
      };
    }
    // Build table header
    const header = `
### Recent ${latestRecord.length} Activity Records
| Date | Type | Name | Distance (km) | Total Duration | Average Pace | Adjusted Pace | Best Pace | Average HR | Average Cadence | Average Power | Training Load | Calories | Ascent (m) | Descent (m) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
`;

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
      return `| ${activityDateFormatted} ` +
        `| ${formatValue(item.sportType)} ` +
        `| ${formatValue(item.name)} ` +
        `| ${distanceKm} ` +
        `| ${durationFormatted} ` +
        `| ${formatValue(item.avgSpeed)} ` +
        `| ${formatValue(item.adjustedPace)} ` +
        `| ${formatValue(item.best)} ` +
        `| ${formatValue(item.avgHr)} ` +
        `| ${formatValue(item.avgCadence)} ` +
        `| ${formatValue(item.avgPower)} ` +
        `| ${formatValue(item.trainingLoad)} ` +
        `| ${formatValue(item.calorie)} ` +
        `| ${formatValue(item.ascent)} ` +
        `| ${formatValue(item.descent)} |`;
    }).join('\n');

    const result = header + rows;
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_sport_statistic_summary', 'get summary of sport statistics for the last 4 weeks', {}, async () => {
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
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_training_distribution_data', 'get training distribution data for the last 4 weeks (pace, heart rate, distance)', {}, async () => {
    const distributionData = await fetchDistribution(accessToken);
    if (!distributionData) {
      return {
        content: [{ type: "text", text: "### Last 4 Weeks Training Distribution Data\n\nSorry, could not retrieve training distribution data." }]
      };
    }
    let result = "### Last 4 Weeks Training Distribution Data:\n\n";
    // Helper function: format distribution data
    const formatDistributionTable = (title: string, distributions: any) => {
      let table = `#### ${title}:
      `;
      table += `| Index | Percentage | Value |
      `;
      table += `|---|---|---|
      `;
      // Iterate through each dimension (distance, duration, trainingLoad, count)
      for (const key in distributions) {
        if (distributions.hasOwnProperty(key) && distributions[key].length > 0) {
          table += `**${key} Distribution:**
      `;
          distributions[key].forEach((item: Distribution) => {
            const radioFormatted = (item.radio * 100).toFixed(2) + '%'; // Convert to percentage
            table += `| ${item.index} | ${radioFormatted} | ${item.value.toFixed(2)} |
      `;
          });
        }
      }
      table += '\n'; // Add empty line between categories
      return table;
    };
    // 1. Pace Zone Distribution
    if (distributionData.paceZone) {
      result += formatDistributionTable("Pace Zone Distribution", distributionData.paceZone);
    }
    // 2. Heart Rate Zone Distribution
    if (distributionData.thresholdHeartRateZones) {
      result += formatDistributionTable("Heart Rate Zone Distribution", distributionData.thresholdHeartRateZones);
    }
    // 3. Distance Distribution (special structure, needs separate handling)
    if (distributionData.distance) {
      result += `#### Distance Distribution:
      `;
      result += `| Index | Percentage | Value |
      `;
      result += `|---|---|---|
      `;
      if (distributionData.distance.count && distributionData.distance.count.length > 0) {
        result += `**Count Distribution:**
      `;
        distributionData.distance.count.forEach(item => {
          const radioFormatted = item.radio.toFixed(2) + '%';
          result += `| ${item.index} | ${radioFormatted} | ${item.value.toFixed(2)} |
      `;
        });
      }
      if (distributionData.distance.duration && distributionData.distance.duration.length > 0) {
        result += `**Duration Distribution:**
      `;
        distributionData.distance.duration.forEach(item => {
          const radioFormatted = item.radio.toFixed(2) + '%';
          result += `| ${item.index} | ${radioFormatted} | ${item.value.toFixed(2)} |\n`;
        });
      }
      if (distributionData.distance.trainingLoad && distributionData.distance.trainingLoad.length > 0) {
        result += `**Training Load Distribution:**
      `;
        distributionData.distance.trainingLoad.forEach(item => {
          const radioFormatted = item.radio.toFixed(2) + '%';
          result += `| ${item.index} | ${radioFormatted} | ${item.value.toFixed(2)} |\n`;
        });
      }
      result += '\n';
    }
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_weekly_training_summary', 'get weekly training summary for the last 4 weeks including actual vs. target', {}, async () => {
    const activeRecords = await fetchActiveRecord(accessToken);
    if (!activeRecords || activeRecords.length === 0) {
      return {
        content: [{ type: "text", text: "### Last 4 Weeks Weekly Training Summary\n\nSorry, could not retrieve your weekly training summary data." }]
      };
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
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_long_term_training_load_status', 'get long-term and short-term training load status for the last 12 weeks', {}, async () => {
    const tracingStatus = await fetchTracingStatus(accessToken);
    if (!tracingStatus || tracingStatus.length === 0) {
      return {
        content: [{ type: "text", text: "### Last 12 Weeks Training Load Status\n\nSorry, could not retrieve your training load status data." }]
      };
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
    return {
      content: [{ type: "text", text: result }]
    };
  });

  const transport = new StdioServerTransport();

  await server.connect(transport);
};

runServer();
