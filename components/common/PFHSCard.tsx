import { PFHSResult } from "@/utils/PFHS";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import styles from "@/style/AppStyles";

interface PFHSCardProps {
  result: PFHSResult | null;
  loading: boolean;
}

const PFHSCard: React.FC<PFHSCardProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <View style={styles.pfhsCard}>
        <Text style={styles.pfhsTitle}>Finance Health Score</Text>
        <Text style={styles.pfhsLoadingText}>Calculating current month score...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.pfhsCard}>
        <Text style={styles.pfhsTitle}>Finance Health Score</Text>
        <Text style={styles.pfhsEmptyText}>Unable to compute score right now.</Text>
      </View>
    );
  }

  const statusColor =
    result.status === "Financially Healthy"
      ? "#4caf50"
      : result.status === "Stable"
        ? "#fbc02d"
        : result.status === "Vulnerable"
          ? "#ff9800"
          : "#f44336";

  const statusIcon =
    result.status === "Financially Healthy" ? (
      <ShieldCheck color={statusColor} size={22} />
    ) : result.status === "Financial Risk" ? (
      <ShieldX color={statusColor} size={22} />
    ) : (
      <ShieldAlert color={statusColor} size={22} />
    );

  const asPercent = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <View style={styles.pfhsCard}>
      <View style={styles.pfhsHeader}>
        <Text style={styles.pfhsTitle}>Finance Health Score</Text>
        {statusIcon}
      </View>

      <View style={styles.pfhsScoreRow}>
        <Text style={styles.pfhsScoreValue}>{result.pfhs}</Text>
        <Text style={styles.pfhsScoreMax}>/100</Text>
        <View style={[styles.pfhsStatusBadge, { borderColor: statusColor }]}>
          <Text style={[styles.pfhsStatusText, { color: statusColor }]}>
            {result.status}
          </Text>
        </View>
      </View>

      <View style={styles.pfhsSubscores}>
        <View style={styles.pfhsSubscoreItem}>
          <Text style={styles.pfhsSubscoreLabel}>SR NORM</Text>
          <Text style={styles.pfhsSubscoreValue}>
            {asPercent(result.metrics.SR_norm)}
          </Text>
        </View>
        <View style={styles.pfhsSubscoreItem}>
          <Text style={styles.pfhsSubscoreLabel}>BAS</Text>
          <Text style={styles.pfhsSubscoreValue}>{asPercent(result.metrics.BAS)}</Text>
        </View>
        <View style={styles.pfhsSubscoreItem}>
          <Text style={styles.pfhsSubscoreLabel}>CSE</Text>
          <Text style={styles.pfhsSubscoreValue}>{asPercent(result.metrics.CSE)}</Text>
        </View>
      </View>

      {!result.hasBudgetData && (
        <Text style={styles.pfhsBudgetHint}>
          Add monthly budgets to improve score accuracy.
        </Text>
      )}

      <View style={styles.pfhsInsightsContainer}>
        {result.insights.map((insight, index) => (
          <View key={`${insight}-${index}`} style={styles.pfhsInsightItem}>
            <Text style={styles.pfhsInsightText}>• {insight}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PFHSCard;
