import { createContext, useContext } from "react"
import {
    Text,
    TextProps,
    TouchableOpacity,
    ActivityIndicator,
    TouchableOpacityProps,
} from "react-native"
import clsx from "clsx"

type Variants = "primary" | "secondary" | "destructive" | "destructive-outlined" | "outline"

type ButtonProps = TouchableOpacityProps & {
    variant?: Variants
    isLoading?: boolean
}

const ThemeContext = createContext<{ variant?: Variants }>({})

function Button({
    variant = "primary",
    children,
    isLoading,
    className,
    ...rest
}: ButtonProps) {
    return (
        <TouchableOpacity
            className={clsx(
                "h-11 flex-row items-center justify-center rounded-lg gap-2 px-2",
                {
                    "bg-lime-300": variant === "primary",
                    "bg-zinc-800": variant === "secondary",
                    "bg-red-700/75": variant === "destructive",
                    "bg-red-700/10 border border-red-700": variant === "destructive-outlined",
                    "bg-zinc-800/10 border border-zinc-800": variant === "outline",
                },
                className
            )}
            activeOpacity={0.7}
            disabled={isLoading}
            {...rest}
        >
            <ThemeContext.Provider value={{ variant }}>
                {isLoading ? <ActivityIndicator className="text-zinc-200" /> : children}
            </ThemeContext.Provider>
        </TouchableOpacity>
    )
}

function Title({ children }: TextProps) {
    const { variant } = useContext(ThemeContext)

    return (
        <Text
            className={clsx("text-base font-semibold", {
                "text-lime-950": variant === "primary",
                "text-zinc-200": variant === "secondary",
                "text-zinc-200 text-center": variant === "destructive" || variant === "destructive-outlined",
                "text-zinc-300": variant === "outline",
            })}
        >
            {children}
        </Text>
    )
}

Button.Title = Title

export { Button }
