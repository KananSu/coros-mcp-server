import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from 'zod';

import { get_sport_statistic_summary } from "./get_sport_statistic_summary.js";
import { get_user_running_fitness } from "./get_user_running_fitness.js";
import { get_current_week_activity_record } from "./get_current_week_activity_record.js";
import { get_latest_activity_record } from "./get_latest_activity_record.js";
import { get_long_term_training_load_status } from "./get_long_term_training_load_status.js";
import { get_training_distribution_data } from "./get_training_distribution_data.js";
import { get_weekly_training_summary } from "./get_weekly_training_summary.js";


export function setupTools(server: McpServer, accessToken: string) {
  server.tool('get_user_running_fitness', 'get user running fitness info', {}, async () => {
    const result = await get_user_running_fitness(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_current_week_activity_record', 'get current week activity record', {}, async () => {
    const result = await get_current_week_activity_record(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });


  server.tool('get_latest_activity_record', 'get latest activity record', {
    size: z.number().optional(),
  }, async ({ size }) => {
    const result = await get_latest_activity_record(accessToken, size);
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_sport_statistic_summary', 'get summary of sport statistics for the last 4 weeks', {}, async () => {
    const result = await get_sport_statistic_summary(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_training_distribution_data', 'get training distribution data for the last 4 weeks (pace, heart rate, distance)', {}, async () => {
    const result = await get_training_distribution_data(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_weekly_training_summary', 'get weekly training summary for the last 4 weeks including actual vs. target', {}, async () => {
    const result = await get_weekly_training_summary(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });

  server.tool('get_long_term_training_load_status', 'get long-term and short-term training load status for the last 12 weeks', {}, async () => {
    const result = await get_long_term_training_load_status(accessToken);
    return {
      content: [{ type: "text", text: result }]
    };
  });
}