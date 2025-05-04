export default function JointController({ jointName, min, max, value, onChange }: { jointName: string; min: number; max: number; value: number; onChange: (val: number) => void }) {
    return <label>
        {jointName} : {value}°
        <br />
        <input
            type="range"
            min={min}
            max={max}
            step="0.01"
            value={value}
            className='w-full'
            onChange={(e) => onChange(parseInt(e.target.value))}
        />
    </label>
}