# coros-mcp-server

⚠️ This repository is using a **non-public API** from [COROS Training Hub](https://t.coros.com/) that could break anytime.

## Overview
coros-mcp-server is a Model Context Protocol server application that retrieves fitness data from Coros sports devices. This server provides various utility functions to query user basic information, exercise records, training statistics, and training distribution data.

## Features
### Tools
- `get_user_running_fitness` - Retrieve user basic information and fitness capability
- `get_current_week_activity_record` - Get weekly exercise goals and achievements
- `get_latest_activity_record` - Fetch detailed records of recent activities
- `get_sport_statistic_summary` - Obtain summary statistics for the last 4 weeks
- `get_training_distribution_data` - View training distribution across pace, heart rate, and distance

## Installation
### Prerequisites
- Node.js
- npm or yarn
- Coros account credentials

### Installing from Source
1. Clone this repository
2. Create a `.env` file in the project root with the following variables:
```
COROS_API_URL=<Coros API base URL>
COROS_EMAIL=<your Coros account email>
COROS_PASSWORD=<your Coros account password>
```
3. Install dependencies:
```bash
npm install
```
3. Build the project:
```bash
npm run build
```

## Usage
### Starting the Server
```bash
npm run start
```

### Available Tools
#### 1. Get User Running Fitness
- **Name**: `get_user_running_fitness`
- **Description**: Retrieves basic user information and fitness capability metrics
- **Parameters**: None
- **Returns**: Formatted text table with user age, gender, heart rate, height, weight and other metrics

#### 2. Get Current Week Activity Record
- **Name**: `get_current_week_activity_record`
- **Description**: Gets weekly exercise targets and actual completion status
- **Parameters**: None
- **Returns**: Comparison table of target vs. actual values for distance, duration, and training load

#### 3. Get Latest Activity Record
- **Name**: `get_latest_activity_record`
- **Description**: Retrieves detailed records of recent activities
- **Parameters**: `size` (optional): Number of records to retrieve (default: 10)
- **Returns**: Detailed table with date, type, distance, duration, pace and other metrics

#### 4. Get Sport Statistic Summary
- **Name**: `get_sport_statistic_summary`
- **Description**: Obtains summary statistics for the last 4 weeks
- **Parameters**: None
- **Returns**: Aggregated information including total distance, total duration, total training load

#### 5. Get Training Distribution Data
- **Name**: `get_training_distribution_data`
- **Description**: Views training distribution across pace, heart rate, and distance for the last 4 weeks
- **Parameters**: None
- **Returns**: Distribution tables with percentage and values across different intervals

## License
This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE) file for details.
