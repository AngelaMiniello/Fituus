import { useCallback, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Line } from "react-native-svg";
import { pointOnCurve, weightCurve, WeightRecord } from "@/lib/weightCurve";

export default function WeightChart({ entries, example = false }: { entries: WeightRecord[]; example?: boolean }) {
  const [width, setWidth] = useState(280);
  const [progress, setProgress] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const height = 200;
  const curve = useMemo(() => weightCurve(entries, width, height), [entries, width]);
  const dot = pointOnCurve(curve, progress);
  const start = curve.points[0];
  const end = curve.points[curve.points.length - 1];

  useFocusEffect(useCallback(() => {
    let active = true;
    animation.setValue(0);
    setProgress(0);
    const listener = animation.addListener(({ value }) => setProgress(value));
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!active) return;
      if (reduce || entries.length < 2) animation.setValue(1);
      else Animated.timing(animation, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start();
    }).catch(() => { if (active) animation.setValue(1); });
    return () => { active = false; animation.stopAnimation(); animation.removeListener(listener); };
  }, [animation, curve, entries.length]));

  const date = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <View onLayout={event => setWidth(Math.max(100, event.nativeEvent.layout.width))}
      accessible accessibilityLabel={`${example ? "Example weight chart" : "Weight history"}: ${entries[0].weight} to ${entries[entries.length - 1].weight} kilograms`}>
      <View className="flex-row justify-between mb-2">
        <Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-slate-600">{entries[0].weight} kg</Text>
        <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xs text-[#8A5435]">{entries[entries.length - 1].weight} kg</Text>
      </View>
      <Svg width={width} height={height}>
        <Defs><LinearGradient id="weightShade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#E3AA88" stopOpacity={0.25} /><Stop offset="1" stopColor="#E3AA88" stopOpacity={0} /></LinearGradient></Defs>
        <Line x1={20} x2={width - 20} y1={start.y} y2={start.y} stroke="#DDE3EB" strokeDasharray="4 4" />
        {entries.length > 1 && <Path d={`${curve.path} L ${end.x} ${height} L ${start.x} ${height} Z`} fill="url(#weightShade)" opacity={progress} />}
        {entries.length > 1 && <Path d={curve.path} fill="none" stroke="#E3AA88" strokeWidth={3} strokeLinecap="round" strokeDasharray={`${curve.length} ${curve.length}`} strokeDashoffset={curve.length * (1 - progress)} />}
        <Circle cx={start.x} cy={start.y} r={4} fill="#FFFFFF" stroke="#E3AA88" strokeWidth={2} />
        <Circle cx={dot.x} cy={dot.y} r={10} fill="#E3AA88" opacity={0.2} />
        <Circle cx={dot.x} cy={dot.y} r={5} fill="#FFFFFF" stroke="#E3AA88" strokeWidth={2.5} />
      </Svg>
      <View className="flex-row justify-between mt-1">
        <Text style={{ fontFamily: "Chillax-Regular" }} className="text-[10px] text-slate-500">{example ? "Starting point" : date(entries[0].recordedAt)}</Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="text-[10px] text-slate-500">{example ? "Latest entry" : date(entries[entries.length - 1].recordedAt)}</Text>
      </View>
    </View>
  );
}
