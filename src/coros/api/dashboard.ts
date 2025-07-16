import axios from "axios";
import { formatDate, secondsToPace } from "../utils/utils.js";

const DASHBOARD_QUERY_URL = '/dashboard/query'
const DASHBOARD_DETAIL_URL = '/dashboard/detail/query'

interface SummaryInfo {
  // Running Fitness
  staminaLevel: number,
  // Aerobic Endurance
  aerobicEnduranceScore: number,
  // Lactate Threshold Capacity
  lactateThresholdCapacityScore: number,
  // Anaerobic Endurance
  anaerobicEnduranceScore: number,
  // Anaerobic Capacity
  anaerobicCapacityScore: number,
  // Recovery Percent
  recoveryPct: number,
  // Max Heart Rate
  fitnessMaxHr: number,
  // Recovery Hours
  fullRecoveryHours: number,
  // Lactate Threshold Heart Rate
  lthr: number,
  // Lactate Threshold Heart Rate Zone
  lthrZone: any,
  // Lactate Threshold Pace
  ltsp: number,
  // Lactate Threshold Pace Zone
  ltspZone: any,
}

export async function fetchSummaryInfo(accessToken: string): Promise<SummaryInfo> {
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${DASHBOARD_QUERY_URL}`, {
      headers: {
        'Accesstoken': accessToken,
      }
    })
      .then((res) => {
        const { summaryInfo } = res.data.data;
        const info: SummaryInfo = {
          staminaLevel: summaryInfo.staminaLevel,
          aerobicEnduranceScore: summaryInfo.aerobicEnduranceScore,
          lactateThresholdCapacityScore: summaryInfo.lactateThresholdCapacityScore,
          anaerobicEnduranceScore: summaryInfo.anaerobicEnduranceScore,
          anaerobicCapacityScore: summaryInfo.anaerobicCapacityScore,
          recoveryPct: summaryInfo.recoveryPct,
          fitnessMaxHr: summaryInfo.fitnessMaxHr,
          fullRecoveryHours: summaryInfo.fullRecoveryHours,
          lthr: summaryInfo.lthr,
          lthrZone: summaryInfo.lthrZone,
          ltsp: summaryInfo.ltsp,
          ltspZone: summaryInfo.ltspZone
        };
        resolve(info);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

interface SportDataDetail {
  date: string,
  distance: number,
  duration: number,
  trainingLoad: number,
  avgPace: string,
}

interface CurrentWeekRecord {
  distanceRecord: {
    totalTarget: number,
    totalValue: number,
  },
  durationRecord: {
    totalTarget: number,
    totalValue: number,
  },
  tlRecord: {
    totalTarget: number,
    totalValue: number,
  },
  sportDataDetail: SportDataDetail[],
}

export async function fetchSportDataList(accessToken: string): Promise<CurrentWeekRecord> {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.COROS_API_URL}${DASHBOARD_DETAIL_URL}`, options)
      .then((res) => {
        const { sportDataList, currentWeekRecord } = res.data.data;
        const { distanceRecord, durationRecord, tlRecord} =  currentWeekRecord;
        const {
          totalTarget: distanceTotalTarget,
          totalValue: distanceTotalValue,
        } = distanceRecord;
        const {
          totalTarget: durationTotalTarget,
          totalValue: durationTotalValue,
        } = durationRecord;
        const {
          totalTarget: tlTotalTarget,
          totalValue: tlTotalValue,
        } = tlRecord;
        const sportData: SportDataDetail[] = [];
        sportDataList?.forEach((item: any) => {
          sportData.push({
            date: item.date ? formatDate(item.date): '-',
            distance: item.distance,
            duration: item.duration,
            trainingLoad: item.trainingLoad,
            avgPace: secondsToPace(item.avgPace),
          })
        })
        resolve({
          sportDataDetail:  sportData,
          distanceRecord: {
              totalTarget: distanceTotalTarget,
              totalValue: distanceTotalValue,
          },
          durationRecord: {
              totalTarget: durationTotalTarget,
              totalValue: durationTotalValue,
          },
          tlRecord: {
            totalTarget: tlTotalTarget,
            totalValue: tlTotalValue,
          }
        });
      })
      .catch((err) => {
        reject(err);
      })
  })
}
