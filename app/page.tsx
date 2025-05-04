import ButtonLink from "@/components/ButtonLink";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3">
      <div>
        <h1 className="text-5xl mb-3">Mentor Interface</h1>
        <div className="flex flex-col gap-3">
          <ButtonLink href={'/manualcontrol'}>Manual Control</ButtonLink>
          <ButtonLink href={'/dashboard'}>Sequence Control</ButtonLink>
          <ButtonLink href="/">Monitor & Debug</ButtonLink>
          <ButtonLink href={'/configure'}>Configure</ButtonLink>
          <ButtonLink href={'/dashboard'}>Connect</ButtonLink>
        </div>
      </div>
    </div>
  );
}
