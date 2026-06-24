const FireAnimation = ({ bottom = '28%', left = '49%' }: { bottom?: string; left?: string }) => (
    <>
        <div className="flame absolute" style={{
            bottom,
            left,
            transform: 'translateX(-50%)',
            width: '80px',
            height: '100px',
            background: 'radial-gradient(ellipse at bottom, #ff6600 0%, #ff9900 40%, transparent 70%)',
            borderRadius: '50% 50% 30% 30%',
            filter: 'blur(6px)',
            opacity: 0.9,
        }} />
        <div className="flame absolute" style={{
            bottom,
            left: '47.6%',
            transform: 'translateX(-50%)',
            width: '40px',
            height: '100px',
            background: 'radial-gradient(ellipse at bottom, #ffcc00 0%, #ff6600 50%, transparent 80%)',
            borderRadius: '50% 50% 30% 30%',
            filter: 'blur(6px)',
            opacity: 0.9,
            animationDelay: '0.2s',
        }} />
    </>
);

export default FireAnimation;