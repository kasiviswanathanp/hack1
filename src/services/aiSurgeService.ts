import { Complaint, ComplaintCategory, PriorityLevel } from '@/types';

export interface AreaSurgeSummary {
  areaName: string;
  wardId: string;
  zoneId: string;
  totalReports: number;
  activeReports: number;
  criticalReports: number;
  primaryCategory: ComplaintCategory;
  surgeMultiplier: number; // e.g. 3.5x normal baseline
  isTopHotspot: boolean;
  aiAdvisory: string;
  correlatedComplaintIds: string[];
}

export interface HotspotAnalyticsResult {
  topHotspot: AreaSurgeSummary | null;
  areaSummaries: AreaSurgeSummary[];
  totalComplaintsAnalyzed: number;
  highRiskAreaCount: number;
  cityWideHotspotAdvisory: string;
}

export const aiSurgeService = {
  /**
   * Computes spatial frequency and area complaint surges across all incoming reports.
   * Identifies high-density clusters where complaints are concentrated.
   */
  computeAreaSurgeAnalytics(complaints: Complaint[]): HotspotAnalyticsResult {
    if (!complaints || complaints.length === 0) {
      return {
        topHotspot: null,
        areaSummaries: [],
        totalComplaintsAnalyzed: 0,
        highRiskAreaCount: 0,
        cityWideHotspotAdvisory: 'No active complaints to analyze.',
      };
    }

    // Group complaints by area
    const areaMap = new Map<string, Complaint[]>();
    for (const c of complaints) {
      const area = c.location?.area || c.areaId || 'Anna Nagar West';
      if (!areaMap.has(area)) {
        areaMap.set(area, []);
      }
      areaMap.get(area)!.push(c);
    }

    const summaries: AreaSurgeSummary[] = [];

    areaMap.forEach((compList, areaName) => {
      const total = compList.length;
      const active = compList.filter((c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length;
      const critical = compList.filter((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH').length;

      // Determine top category in area
      const catCount = new Map<ComplaintCategory, number>();
      for (const c of compList) {
        catCount.set(c.category, (catCount.get(c.category) || 0) + 1);
      }
      let topCat: ComplaintCategory = 'Road';
      let maxCatCount = 0;
      catCount.forEach((cnt, cat) => {
        if (cnt > maxCatCount) {
          maxCatCount = cnt;
          topCat = cat;
        }
      });

      const firstComp = compList[0];
      const wardId = firstComp.location?.ward || firstComp.wardId || 'Ward 102';
      const zoneId = firstComp.location?.zone || firstComp.zoneId || 'Zone 8 (Central)';

      // Baseline normal is ~1.5 complaints per area
      const surgeMultiplier = Number((total / 1.5).toFixed(1));

      let aiAdvisory = `Normal civic inflow for ${areaName}.`;
      if (total >= 4) {
        aiAdvisory = `🔥 AI Critical Cluster Alert: High-frequency surge in ${areaName} (${total} reports, ${critical} high-severity). Primary issue: ${topCat}. Automated routing recommended.`;
      } else if (total >= 2) {
        aiAdvisory = `⚡ Elevated grievance cluster in ${areaName} with ${total} active reports.`;
      }

      summaries.push({
        areaName,
        wardId,
        zoneId,
        totalReports: total,
        activeReports: active,
        criticalReports: critical,
        primaryCategory: topCat,
        surgeMultiplier,
        isTopHotspot: false, // will set below
        aiAdvisory,
        correlatedComplaintIds: compList.map((c) => c.id),
      });
    });

    // Sort areas by total reports descending
    summaries.sort((a, b) => b.totalReports - a.totalReports || b.criticalReports - a.criticalReports);

    if (summaries.length > 0) {
      summaries[0].isTopHotspot = true;
    }

    const topHotspot = summaries[0] || null;
    const highRiskAreaCount = summaries.filter((s) => s.totalReports >= 3).length;

    const cityWideHotspotAdvisory = topHotspot
      ? `AI Geo-Surge Detection: ${topHotspot.areaName} (${topHotspot.wardId}) has the highest complaint volume in the city with ${topHotspot.totalReports} correlated reports (${topHotspot.surgeMultiplier}x baseline). Pushing to TOP priority.`
      : 'All municipal areas operating within normal SLA thresholds.';

    return {
      topHotspot,
      areaSummaries: summaries,
      totalComplaintsAnalyzed: complaints.length,
      highRiskAreaCount,
      cityWideHotspotAdvisory,
    };
  },

  /**
   * Intelligently sorts and prioritizes complaints so that:
   * 1. Whichever area has the most reports (Hotspot Area), its complaints are placed FIRST (AT THE VERY TOP)!
   * 2. Within that area, highest severity complaints come first.
   * 3. Other areas follow in descending order of area complaint density.
   */
  prioritizeComplaintsByAiHotspot(complaints: Complaint[]): Complaint[] {
    if (!complaints || complaints.length === 0) return [];

    const { topHotspot, areaSummaries } = this.computeAreaSurgeAnalytics(complaints);
    const areaSummaryMap = new Map<string, AreaSurgeSummary>();
    for (const s of areaSummaries) {
      areaSummaryMap.set(s.areaName, s);
    }

    const priorityWeight: Record<PriorityLevel, number> = {
      CRITICAL: 400,
      HIGH: 300,
      MEDIUM: 200,
      LOW: 100,
    };

    // Enrich complaints with AI Hotspot metadata
    const enriched = complaints.map((c) => {
      const area = c.location?.area || c.areaId || 'Anna Nagar West';
      const summary = areaSummaryMap.get(area);
      const isTop = topHotspot?.areaName === area;
      const areaCount = summary?.totalReports || 1;
      const isHotspot = areaCount >= 3 || isTop;

      return {
        ...c,
        isAiHotspot: isHotspot,
        isHighestSurgeArea: isTop,
        areaReportCount: areaCount,
        hotspotCategory: summary?.primaryCategory || c.category,
        hotspotSurgeScore: (areaCount * 1000) + (priorityWeight[c.priority] || 100),
        hotspotAdvisory: isTop
          ? `🔥 AI #1 Hotspot: ${area} has ${areaCount} active complaints. Promoted to Top of Queue.`
          : isHotspot
          ? `⚡ Area Cluster: ${area} (${areaCount} reports)`
          : undefined,
      };
    });

    // Sort: High-volume Hotspot Area Complaints ALWAYS come FIRST (TOP)
    enriched.sort((a, b) => {
      // 1. Sort by area report volume descending (whichever area has more complaints goes first)
      const countA = a.areaReportCount || 0;
      const countB = b.areaReportCount || 0;
      if (countB !== countA) {
        return countB - countA;
      }

      // 2. Within the same area, sort by Priority Severity (CRITICAL -> HIGH -> MEDIUM -> LOW)
      const pA = priorityWeight[a.priority] || 0;
      const pB = priorityWeight[b.priority] || 0;
      if (pB !== pA) {
        return pB - pA;
      }

      // 3. Newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return enriched;
  },

  /**
   * Specifically returns high-volume hotspot alerts for a given Zonal Supervisor.
   * Matches the user requirement: "ஒவ்வொரு பர்டிகுலர் ஏரியாக்கும் உள்ள அந்த சூப்பர்வைசர்ட்ட போய் காமிக்கணும்"
   */
  getSupervisorZoneHotspots(complaints: Complaint[], supervisorZone: string = 'Zone 8 (Central)') {
    const { areaSummaries } = this.computeAreaSurgeAnalytics(complaints);

    // Filter summaries for this supervisor's zone (or top zone if not specified)
    const zoneSummaries = areaSummaries.filter(
      (s) => !supervisorZone || s.zoneId.toLowerCase().includes(supervisorZone.toLowerCase().slice(0, 6))
    );

    const targetSummary = zoneSummaries[0] || areaSummaries[0] || null;

    if (!targetSummary) {
      return {
        hasSurge: false,
        topArea: null,
        zoneName: supervisorZone,
        message: 'No active surges in your assigned zone.',
        surgeComplaints: [],
      };
    }

    const surgeComplaints = complaints.filter(
      (c) => (c.location?.area || c.areaId) === targetSummary.areaName
    );

    return {
      hasSurge: targetSummary.totalReports >= 2,
      topArea: targetSummary,
      zoneName: supervisorZone,
      message: `Supervisor Alert: ${targetSummary.areaName} (${targetSummary.wardId}) has ${targetSummary.totalReports} active complaints in ${supervisorZone}. Highest surge in your jurisdiction.`,
      surgeComplaints,
    };
  },
};
