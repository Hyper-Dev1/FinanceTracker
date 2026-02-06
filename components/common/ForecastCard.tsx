import styles from "@/style/AppStyles";
import { ForecastResult, formatForecastMessage } from "@/utils/BalanceForecast";
import { Minus, TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface ForecastCardProps {
  forecast: ForecastResult;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  if (forecast.confidence === "low") return null;

  const trendIcon = () => {
    switch (forecast.trend) {
      case "increasing":
        return <TrendingUp color="#4caf50" size={24} />;
      case "decreasing":
        return <TrendingDown color="#f44336" size={24} />;
      default:
        return <Minus color="#999" size={24} />;
    }
  };

  const trendColor = () => {
    switch (forecast.trend) {
      case "increasing":
        return "#4caf50";
      case "decreasing":
        return "#f44336";
      default:
        return "#999";
    }
  };

  return (
    <View style={styles.forecastCard}>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastTitle}>AI Balance Forecast</Text>
        {trendIcon()}
      </View>

      <Text style={styles.forecastMessage}>
        {formatForecastMessage(forecast)}
      </Text>

      <View style={styles.forecastStats}>
        <View style={styles.forecastStatItem}>
          <Text style={styles.forecastStatLabel}>Daily Trend</Text>
          <Text style={[styles.forecastStatValue, { color: trendColor() }]}>
            {forecast.dailyBurnRate > 0 ? "+" : ""}
            Rs {Math.abs(forecast.dailyBurnRate).toFixed(0)}
          </Text>
        </View>

        <View style={styles.forecastStatItem}>
          <Text style={styles.forecastStatLabel}>30-Day Outlook</Text>
          <Text style={styles.forecastStatValue}>
            Rs{" "}
            {forecast.forecastBalance30Days.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      </View>

      {forecast.predictedZeroDate && (
        <View style={styles.forecastAlert}>
          <Text style={styles.forecastAlertText}>
            Projected zero balance:{" "}
            {forecast.predictedZeroDate.toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ForecastCard;
