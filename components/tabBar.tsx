import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { Ban, CircleDollarSignIcon, LucideProps, ShoppingCart, User } from "lucide-react-native";
import * as NavigationBar from 'expo-navigation-bar';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

  const [pageTitle, setPageTitle] = useState<Number>()
  const item: { [key: string]: (props: LucideProps) => JSX.Element } = {
    Loja: (props: LucideProps) => <ShoppingCart {...props} />,
    Perfil: (props: LucideProps) => <User {...props} />,
    'Mercado Noturno': (props: LucideProps) => <CircleDollarSignIcon {...props} />,
  };
  const colors = {
    primary: "#0a0a0a",
    text: "#71717a",
    textSelected: "#fafafa",
  }

  return (
    <View className={`flex-row justify-between gap-1 bg-neutral-800 mx-2 items-center py-2 px-2 absolute bottom-2 ${pageTitle === 2 ? "rounded-b-3xl" : "rounded-full shadow-black shadow-xl"}`}
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
            "profile/tab/index"
          ].includes(route.name)
        )
          return null;

        useEffect(() => {
          setPageTitle(state.index)
        }, [state.index])

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

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            activeOpacity={0.6}
            className="flex-grow justify-around py-1.5 px-5 flex-row text-nowrap text-center items-center rounded-full bg-neutral-900"
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
