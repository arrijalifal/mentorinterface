export default function JointController({ jointName, min, max, value, onChange, onReset }: { jointName: string; min: number; max: number; value: number; onChange: (val: number) => void; onReset: () => void }) {
    return <label>
        {jointName} : <input type="text" name="" id="" className="w-10 text-right" value={value} onChange={(e) => onChange(parseInt(e.target.value))}/>°
        <button hidden={(value === 0)} className="ml-3" onClick={onReset}>↻</button>
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