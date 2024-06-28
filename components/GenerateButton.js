import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"

export default function GeneratorButton({ isWaiting }) {
    return (
        <button
            disabled={isWaiting}
            type="submit"
            className="disabled:bg-pink-400 disabled:cursor-wait bg-pink-500 hover:bg-pink-600 active:bg-pink-700 border-2 border-pink-700 text-white h-[52px] font-semibold rounded-lg w-full">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
            Generate
        </button>
    )
}