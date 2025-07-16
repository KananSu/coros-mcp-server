import axios from "axios";
import { formatDate, secondsToPace, secondsToTime } from "../utils/utils.js";
import { Distribution } from "../utils/type.js";

const ANALYSE_DETAIL_URL = '/analyse/query'

interface ActiveRecord {
  firstDayOfWeek: number,
  lastDayInWeek: number,
  targetDistance: number,
  actualDistance: number,
  targetActiveTime?: string,
  actualActiveTime?: string,
  targetTrainingLoad?: number,
  actualTrainingLoad?: number,
}

export async function fetchActiveRecord(accessToken: string): Promise<ActiveRecord[]> {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}`, options)
      .then((res) => {
        const { record } = res.data.data;
        const { distanceRecord, durationRecord, tlRecord } = record;
        const activeRecord: Array<ActiveRecord> = new Array();
        const weekToRecord: Map<number, ActiveRecord> = new Map();
        distanceRecord.forEach((item: any) => {
          activeRecord.push({
            firstDayOfWeek: item.firstDayOfWeek,
            lastDayInWeek: item.lastDayInWeek,
            targetDistance: item.target,
            actualDistance: item.value,
          })
          weekToRecord.set(item.firstDayOfWeek, item);
        });
        durationRecord.forEach((item: any) => {
          const record = weekToRecord.get(item.firstDayOfWeek);
          if (record) {
            record.targetActiveTime = secondsToTime(item.target);
            record.actualActiveTime = secondsToTime(item.value);
          }
        });
        tlRecord.forEach((item: any) => {
          const record = weekToRecord.get(item.firstDayOfWeek);
          if (record) {
            record.targetTrainingLoad = item.target;
            record.actualTrainingLoad = item.value;
          }
        })
        resolve(activeRecord);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

interface TracingStatus {
  date: string,
  // Short-term load
  loadImpact: number,
  // Long-term load
  baseFitness: number,
  radio: number,
}

export async function fetchTracingStatus(accessToken: string): Promise<TracingStatus[]> {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}`, options)
      .then((res) => {
        const { dayList } = res.data.data;
        const tracingStatus: Array<TracingStatus> = new Array();
        dayList.forEach((item: any) => {
          tracingStatus.push({
            date: item.happenDay ? formatDate(item.happenDay): '-',
            loadImpact: item.ati,
            baseFitness: item.cti,
            radio: item.ati / item.cti,
          })
        })
        resolve(tracingStatus);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

interface SportStatistic {
  // Distance: meters
  distance: number,
  // Time: seconds
  duration: number,
  // Training Load: TL
  trainingLoad: number,
  // Average Heart Rate: bpm
  avgHeartRate: number,
  // Total count
  count: number,
  // Average pace
  avgPace?: string,
}

export async function fetchSportStatistic(accessToken: string): Promise<SportStatistic> {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}`, options)
      .then((res) => {
        const { sportStatistic } = res.data.data;
        const statistic: SportStatistic = {
          distance: 0,
          duration: 0,
          trainingLoad: 0,
          avgHeartRate: 0,
          count: 0,
          avgPace: '',
        };
        sportStatistic?.forEach((item: any) => {
          statistic.distance = item.distance;
          statistic.duration = item.duration;
          statistic.trainingLoad = item.trainingLoad;
          statistic.avgHeartRate = item.avgHeartRate;
          statistic.count = item.count;
          if (item.avgPace) {
            statistic.avgPace = secondsToPace(item.avgPace);
          }
        })
        resolve(statistic);
      })
      .catch((err) => {
        reject(err);
      })
  })
}


interface PaceZoneDistribution {
  distance: Distribution[],
  duration: Distribution[],
  trainingLoad: Distribution[],
}

interface ThresholdHeartRateZonesDistribution {
  distance: Distribution[],
  duration: Distribution[],
  trainingLoad: Distribution[],
}

interface ThresholdHeartRateZonesDistribution {
  distance: Distribution[],
  duration: Distribution[],
  trainingLoad: Distribution[],
}

interface DistanceDistribution {
  count: Distribution[],
  duration: Distribution[],
  trainingLoad: Distribution[],
}

interface DistributionResult {
  distance: DistanceDistribution,
  thresholdHeartRateZones: ThresholdHeartRateZonesDistribution,
  paceZone: PaceZoneDistribution,
}

function getPaceZoneDistribution(disAreaList: any, timeAreaList: any, tlAreaList: any) {
  const distance: Array<Distribution> = new Array();
  const duration: Array<Distribution> = new Array();
  const trainingLoad: Array<Distribution> = new Array();
  disAreaList?.forEach((item: any) => {
    distance.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  timeAreaList?.forEach((item: any) => {
    duration.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  });
  tlAreaList?.forEach((item: any) => {
    trainingLoad.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  const paceZoneDistribution: PaceZoneDistribution = {
    distance,
    duration,
    trainingLoad,
  }
  return paceZoneDistribution;
}

function getThresholdHeartRateZonesDistribution(hrTimeAreaList: any, hrTlAreaList: any, hrDisAreaList: any) {
  const distance: Array<Distribution> = new Array();
  const duration: Array<Distribution> = new Array();
  const trainingLoad: Array<Distribution> = new Array();
  hrDisAreaList?.forEach((item: any) => {
    distance.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  hrTimeAreaList?.forEach((item: any) => {
    duration.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  });
  hrTlAreaList?.forEach((item: any) => {
    trainingLoad.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  const thresholdHeartRateZonesDistribution: ThresholdHeartRateZonesDistribution = {
    distance,
    duration,
    trainingLoad,
  }
  return thresholdHeartRateZonesDistribution;
}

function getDistanceDistribution(distanceCountAreaList: any, distanceTimeAreaList: any, distanceTlAreaList: any) {
  const count: Array<Distribution> = new Array();
  const duration: Array<Distribution> = new Array();
  const trainingLoad: Array<Distribution> = new Array();
  distanceCountAreaList?.forEach((item: any) => {
    count.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  distanceTimeAreaList?.forEach((item: any) => {
    duration.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  });
  distanceTlAreaList?.forEach((item: any) => {
    trainingLoad.push({
      index: item.index,
      radio: item.radio,
      value: item.value,
    })
  })
  const distanceDistribution: DistanceDistribution = {
    count,
    duration,
    trainingLoad,
  }

  return distanceDistribution;
}

export async function fetchDistribution(accessToken: string): Promise<DistributionResult> {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}`, options)
      .then((res) => {
        const { summaryInfo } = res.data.data;
        const { disAreaList, timeAreaList, tlAreaList, hrTimeAreaList, hrTlAreaList, hrDisAreaList, distanceCountAreaList, distanceTimeAreaList, distanceTlAreaList } = summaryInfo;
        
        const distanceDistribution = getDistanceDistribution(distanceCountAreaList, distanceTimeAreaList, distanceTlAreaList);
        const thresholdHeartRateZonesDistribution = getThresholdHeartRateZonesDistribution(hrTimeAreaList, hrTlAreaList, hrDisAreaList);
        const paceZoneDistribution = getPaceZoneDistribution(disAreaList, timeAreaList, tlAreaList);

        resolve({
          distance: distanceDistribution,
          thresholdHeartRateZones: thresholdHeartRateZonesDistribution,
          paceZone: paceZoneDistribution,
        });
      }).catch((err) => {
        reject(err);
      })
  })
}
