import { Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function CountdownPage() {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const now = new Date();
        let today9pm = new Date(now);
        today9pm.setHours(21, 0, 0, 0);
        if (now.getTime() > today9pm.getTime()) {
            today9pm.setDate(today9pm.getDate() + 1);
        }

        const timeDifference = today9pm.getTime() - now.getTime();
        setRemainingTime(Math.floor(timeDifference / 1000));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
        <View className="w-full h-10 text-center justify-between flex-row px-5 items-center border border-muted-foreground rounded-xl bg-neutral-900 mb-2">
            <Text className="text-white">Loja</Text>
            <View className='flex-row items-center justify-center'>
                <Clock size={15} color={"white"} />
                <Text className="text-white items-center text-center">{" "}Atualiza em:{" "}</Text>
                <Text className="text-white items-center text-center justify-center ordinal slashed-zero tabular-nums">
                    {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                </Text>
            </View>
        </View>
    );
}