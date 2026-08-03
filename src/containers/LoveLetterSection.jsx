import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTypewriter } from '../hooks/useTypewriter';
import { Scene } from '../components/Stage/Stage';
import { LoveLetter } from '../components/Cards/LoveLetter';

// Joins the letter paragraphs and drives the typewriter off the reveal.
// The greeting is rendered separately as script, so it is not typed.
export function LoveLetterSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.25 });

  const body = config.letter.paragraphs.join('\n');
  const { displayText, isComplete, cursorVisible } = useTypewriter(body, {
    speed: 16,
    enabled: isVisible,
  });

  return (
    <Scene id="letter" ariaLabel={config.letter.ariaLabel} sectionRef={ref}>
      <LoveLetter
        date={config.date}
        greeting={config.letter.greeting}
        typedText={displayText}
        signature={config.letter.signature}
        cursorVisible={cursorVisible}
        isComplete={isComplete}
        isVisible={isVisible}
      />
    </Scene>
  );
}
