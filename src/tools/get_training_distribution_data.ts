import { fetchDistribution } from "../coros/api/analyse.js";
import { Distribution } from "../coros/utils/type.js";

export async function get_training_distribution_data(accessToken: string) {
	const distributionData = await fetchDistribution(accessToken);
	if (!distributionData) {
		return '### Last 4 Weeks Training Distribution Data\n\nSorry, could not retrieve training distribution data.';
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
			result += `**Duration Distribution:**`;
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
	return result;
}