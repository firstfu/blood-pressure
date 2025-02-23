/**
 * 通用按鈕元件
 * @file: Button.tsx
 * @description: 實現設計系統中定義的按鈕樣式
 * @author: FirstFu
 * @date: 2024-02-23
 */

import React from "react";
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ButtonVariant = "primary" | "secondary" | "warning" | "danger";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "medium", loading = false, disabled = false, fullWidth = false, children, style, ...props }) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case "secondary":
        return "transparent";
      case "warning":
        return colors.warning;
      case "danger":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case "secondary":
        return colors.primary;
      default:
        return colors.background;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case "secondary":
        return colors.primary;
      default:
        return "transparent";
    }
  };

  const getButtonSize = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case "small":
        return {
          fontSize: 14,
        };
      case "large":
        return {
          fontSize: 18,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          width: fullWidth ? "100%" : "auto",
        },
        getButtonSize(),
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <ActivityIndicator color={getTextColor()} /> : <Text style={[styles.text, { color: getTextColor() }, getTextSize()]}>{children}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
  },
});
