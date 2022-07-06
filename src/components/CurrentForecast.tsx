// import { MdOutlineOpenInNew } from 'react-icons/md';
import { getName } from 'country-list';
import moment from 'moment';
import momenttz from 'moment-timezone';
import { WiSunrise, WiSunset } from 'react-icons/wi';

import useMobile from '../hooks/useMobile';
import { useSelector } from '../store';
import RainChart from './RainChart';

export default function CurrentForecast() {
  const isMobile = useMobile();

  const currentWeather = useSelector((state) => state.weather?.current_weather);
  const currentForecast = useSelector((state) => state.weather?.forecasts);
  const dailyForecast = useSelector((state) => state.weather?.forecasts?.daily[0]);
  const isLoading = useSelector((state) => state.weather?.isRequested);

  const now = moment();
  const offset = currentForecast?.timezone;
  const currentDate = momenttz.tz(now, offset);
  const country = currentWeather?.sys?.country;
  // const currentTime = parseInt(momenttz.tz(now, offset).format('HH'), 10);

  const getStatus = (status: any, time: string) => {
    if (status && time === 'when') {
      if (isLoading) {
        return <div className="w-full my-auto h-2 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />;
      }
      const formatUnix = moment.unix(status).format();
      const formattedTime = momenttz.tz(formatUnix, offset);
      return formattedTime.format('LT');
    }

    if (status && time === 'calendar') {
      if (isLoading) {
        return <div className="w-full my-auto h-2 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />;
      }
      const formatUnix = moment.unix(status).format();
      const formattedTime = momenttz.tz(formatUnix, offset);
      return formattedTime.fromNow();
    }

    return <div className="w-full my-auto h-2 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />;
  };

  return (
    <div className="order-first lg:order-last relative lg:sticky right-0 h-full w-full lg:w-[25rem] bg-gradient-to-t from-[#0b2a63] via-[#0f2746] to-[#324968] overflow-y-hidden lg:overflow-y-auto">
      <div className="p-8 relative flex flex-col justify-between gap-y-10">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col w-1/2 ${isLoading && 'gap-y-8'} `}>
            <span className="text-xl md:text-2xl text-gray-200">
              {isLoading ? (
                <div className="w-full my-auto h-4 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />
              ) : (
                currentWeather?.name
              )}
            </span>

            <span className="text-sm md:text-base text-gray-300 font-thin">
              {isLoading ? (
                <div className="w-1/2 my-auto h-2 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />
              ) : (
                currentWeather && getName(country)
              )}
            </span>
          </div>
          <span className="text-lg md:text-xl text-gray-200 w-12">
            {isLoading ? (
              <div className="w-full my-auto h-2 bg-gray-500 bg-opacity-20 rounded-full animate-pulse" />
            ) : (
              currentWeather && currentDate.format('HH:mm A')
            )}
          </span>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-4">
              {isLoading ? (
                <div className="w-1/2 my-auto h-16 bg-gray-500 bg-opacity-20 rounded-md animate-pulse" />
              ) : (
                currentWeather && (
                  <img
                    src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}${
                      isMobile ? '' : '@2x'
                    }.png`}
                    alt="Weather Icon"
                    className="relative w-16 h-16"
                  />
                )
              )}
            </div>
            <div className="flex flex-col gap-y-4 text-gray-200 font-light">
              <div className="flex justify-between border-gray-500 border-b pb-8">
                {isLoading ? (
                  <div className="w-full flex justify-between">
                    <div className="w-1/2 my-auto h-12 bg-gray-500 bg-opacity-20 rounded-md animate-pulse" />
                    <div className="w-1/3 my-auto h-12 bg-gray-500 bg-opacity-20 rounded-md animate-pulse" />
                  </div>
                ) : (
                  currentWeather && (
                    <>
                      <div>
                        <span className="font-thin tracking-wide text-5xl">{currentWeather?.main.temp.toFixed(0)}</span>
                        <span className="font-thin tracking-tighter text-5xl">°C</span>
                      </div>
                      <span className="capitalize w-28 text-right">{currentWeather?.weather[0].description}</span>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <RainChart />
        <div className="flex flex-col gap-y-3">
          <div className="p-3 w-full flex items-center justify-between h-20 bg-[#2b4878] rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow">
            <WiSunrise className="mr-2 w-12 h-12 text-gray-300" />
            <div className="mr-auto flex flex-col justify-evenly h-full">
              <span className="text-sm text-gray-200 font-light">Sunrise</span>
              <span className="text-base text-gray-200">{getStatus(dailyForecast?.sunrise, 'when')}</span>
            </div>
            <span className="text-gray-200 font-thin text-sm w-12">
              {getStatus(dailyForecast?.sunrise, 'calendar')}
            </span>
          </div>
          <div className="p-3 w-full flex items-center justify-between h-20 bg-[#2b4878] rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow">
            <WiSunset className="mr-2 w-12 h-12 text-gray-300" />
            <div className="mr-auto flex flex-col justify-evenly h-full">
              <span className="text-sm text-gray-200 font-light">Sunset</span>
              <span className="text-base text-gray-200">{getStatus(dailyForecast?.sunset, 'when')}</span>
            </div>
            <span className="text-gray-200 font-thin text-sm w-12">{getStatus(dailyForecast?.sunset, 'calendar')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// {statusDay === 'Sunset' && `Sunset ${getStatus(dailyForecast?.sunset)}`}
// {statusDay === 'Sunrise' && `Sunrise ${getStatus(dailyForecast?.sunrise)}`}
