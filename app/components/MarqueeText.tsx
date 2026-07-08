interface MarqueeTextProps {
  text: string;
  className?: string;
}

export default function MarqueeText({
  text,
  className = "",
}: MarqueeTextProps) {

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div className="inline-flex animate-marquee">
        <span className="pr-16">
          {text}
        </span>
        <span className="pr-16">{text}</span>
      </div>
    </div>
  );
}
