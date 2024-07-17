import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Ban, LucideProps, ShoppingCart, User } from "lucide-react-native";
import * as NavigationBar from 'expo-navigation-bar';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const item: { [key: string]: (props: LucideProps) => JSX.Element } = {
    Loja: (props: LucideProps) => <ShoppingCart {...props} />,
    Perfil: (props: LucideProps) => <User {...props} />,
  };
  const colors = {
    primary: "#0a0a0a",
    text: "#71717a",
    textSelected: "#fafafa",
  }

  return (
    <View className="flex-row justify-between gap-1 bg-neutral-950 items-center py-2 absolute bottom-0 rounded-t-2xl border-t border-gray-900 shadow-black shadow-xl"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        if (
          [
            "showToken/index",
          ].includes(route.name)
        )
          return null;

        const isFocused = state.index === index;
        { NavigationBar.setBackgroundColorAsync(colors.primary) }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 mx-4 py-1 px-5 flex-row gap-1 text-center justify-center items-center rounded-full bg-neutral-800"
          >
            {Object.keys(item).includes(label.toString()) ? item[label.toString()]({
              size: 14,
              color: isFocused ? colors.textSelected : colors.text,
            }) : <Ban size={14} color={isFocused ? colors.textSelected : colors.text} />}
            <Text style={{ color: isFocused ? colors.textSelected : colors.text }}>
              {label.toString()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
