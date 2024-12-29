import Image, { StaticImageData } from "next/image";
interface InfiniteSliderProps {
    Logos: StaticImageData[];
}

export const InfiniteSlider = ({ Logos }: InfiniteSliderProps) => {
    return (        
        <div className="relative m-auto w-[800px] overflow-hidden dark:bg-black before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:dark:bg-[linear-gradient(to_right,black_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:dark:bg-[linear-gradient(to_right,black_0%,rgba(255,255,255,0)_100%)] after:content-['']">
            
            <div className="animate-infinite-slider flex w-[calc(250px*10)]">
                {Logos.map((logo, index) => (
                    <div key={index} className="slide flex w-[75px] items-center justify-center">
                        <Image key={index} src={logo} alt='Icon' />
                    </div>
                ))}
                {Logos.map((logo, index) => (
                    <div key={index} className="slide flex w-[75px] items-center justify-center">
                        <Image key={index} src={logo} alt='Icon' />
                    </div>
                ))}
            </div>
        </div>
    );
}
