import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Pencil, Trash2 } from "lucide-react-native";

interface SwipeableRowProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

const SWIPE_THRESHOLD = 80; // Width of action buttons
const ACTIVATION_THRESHOLD = 60; // Minimum swipe distance to trigger action

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      // Allow swipe left (negative) for delete and right (positive) for edit
      const newValue = startX.value + event.translationX;
      
      // Limit swipe range: -SWIPE_THRESHOLD (delete) to +SWIPE_THRESHOLD (edit)
      if (newValue >= -SWIPE_THRESHOLD && newValue <= SWIPE_THRESHOLD) {
        translateX.value = newValue;
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const translation = translateX.value;

      // Check if swipe right (edit action)
      if (translation > ACTIVATION_THRESHOLD || velocity > 500) {
        translateX.value = withSpring(SWIPE_THRESHOLD, {
          damping: 20,
          stiffness: 90,
        });
      }
      // Check if swipe left (delete action)
      else if (translation < -ACTIVATION_THRESHOLD || velocity < -500) {
        translateX.value = withSpring(-SWIPE_THRESHOLD, {
          damping: 20,
          stiffness: 90,
        });
      }
      // Reset to closed position
      else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? translateX.value / SWIPE_THRESHOLD : 0;
    return {
      opacity: opacity,
    };
  });

  const rightActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? -translateX.value / SWIPE_THRESHOLD : 0;
    return {
      opacity: opacity,
    };
  });

  const handleEditPress = () => {
    translateX.value = withSpring(0);
    onEdit();
  };

  const handleDeletePress = () => {
    translateX.value = withSpring(0);
    onDelete();
  };

  return (
    <View style={styles.container}>
      {/* Left Action (Edit) */}
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEditPress}
          activeOpacity={0.7}
        >
          <Pencil color="#fff" size={24} />
          <Text style={styles.actionText}>{editLabel}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Right Action (Delete) */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeletePress}
          activeOpacity={0.7}
        >
          <Trash2 color="#fff" size={24} />
          <Text style={styles.actionText}>{deleteLabel}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content with Pan Gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  leftAction: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rightAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  actionButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "#ffffff",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});

export default SwipeableRow;
