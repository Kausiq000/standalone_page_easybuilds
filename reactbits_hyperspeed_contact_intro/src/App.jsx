import { useState, Component, useRef, useEffect } from "react";
import WarpText from "./components/WarpText";
import SpecularButton from "./components/SpecularButton";
import AeroShards from "./components/AeroShards";
import ContactStudio from "./components/ContactStudio";
import { preloadStudioTexture } from "./components/studioEngine";
import "./intro.css";

class WebGpuErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("WebGPU initialization failed:", err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function App() {
  const isDirectContact = typeof window !== "undefined" && window.location.pathname.startsWith("/contact");
  const [gpuError, setGpuError] = useState(false);
  const [isDispersing, setIsDispersing] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(isDirectContact);
  const studioRef = useRef(null);

  // Preload luxury studio texture immediately on app mount
  useEffect(() => {
    preloadStudioTexture();
  }, []);

  // Handle client-side routing & popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith("/contact")) {
        setIntroDismissed(true);
        if (studioRef.current) {
          studioRef.current.setCameraView("overview");
        }
      } else {
        setIntroDismissed(false);
        setIsDispersing(false);
        if (studioRef.current) {
          studioRef.current.setCameraView("entryway");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStartTransition = () => {
    if (isDispersing) return;
    setIsDispersing(true);

    // Coordinate camera glide with intro dispersion:
    // start continuous 3D camera travel from entryway to overview (2.2s cinematic ease)
    if (studioRef.current) {
      studioRef.current.startEntrance(2200);
    }

    // Client-side URL update without page reload
    if (typeof window !== "undefined" && window.history && window.history.pushState) {
      window.history.pushState({}, "", "/contact");
    }

    // Dismiss intro overlay after dispersion completes so it consumes 0 GPU
    setTimeout(() => {
      setIntroDismissed(true);
    }, 2200);
  };

  return (
    <main className={`cinematic-root ${isDispersing ? "is-dispersing" : ""}`}>
      {/* 3D Architectural Studio: Always mounted in continuous rendering pipeline */}
      <ContactStudio
        ref={studioRef}
        initialView={isDirectContact ? "overview" : "entryway"}
        isActive={introDismissed}
      />


      {/* Intro Experience: Rendered in front of 3D workspace until dispersed */}
      {!introDismissed && (
        <section
          className={`contact-screen ${isDispersing ? "dispersing" : ""}`}
          aria-label="Contact Us Screen"
        >
          <div
            className={`contact-background ${isDispersing ? "dispersing" : ""}`}
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            {!gpuError && (
              <WebGpuErrorBoundary>
                <AeroShards
                  shardColor="#a1a1aa"
                  accentColor="#e4e4e7"
                  placement="full"
                  material="chrome"
                  markers="plus"
                  count={800}
                  depthOfField={0.75}
                  vignette={0.3}
                  mouseInteraction={!isDispersing}
                  pulseOnClick={!isDispersing}
                  holdToGather={!isDispersing}
                  billow={0.7}
                  glow={0.25}
                  disperse={isDispersing}
                  onError={() => setGpuError(true)}
                />
              </WebGpuErrorBoundary>
            )}
          </div>

          {/* Phase 1 subtle center light pulse */}
          {isDispersing && <div className="cinematic-impact-flash" aria-hidden="true" />}

          <div className={`contact-foreground ${isDispersing ? "dispersing" : ""}`}>
            <div className={`contact-heading-wrap ${isDispersing ? "dispersing" : ""}`}>
              <WarpText
                text="CONTACT US"
                warpStrength={0.08}
                warpScale={1.7}
                speed={0.55}
                lens="bulge"
                pointerInfluence={isDispersing ? 0 : 0.42}
                pointerStrength={isDispersing ? 0 : 0.38}
                refraction={0.018}
                chromatic={isDispersing ? 0.6 : 0.35}
                idleDrift={0.2}
                ripple
                clickRipple={false}
                intro={false}
                fontSize="clamp(3rem, 7vw, 6.5rem)"
                fontWeight={800}
                fontFamily="inherit"
                style={{ height: "clamp(140px, 24vh, 260px)", width: "100%" }}
                color="#ffffff"
                letterSpacing="-0.06em"
              />
            </div>

            <div className={`contact-cta-wrap ${isDispersing ? "dispersing" : ""}`}>
              <SpecularButton
                size="lg"
                radius={18}
                tint="#0f0f0f"
                tintOpacity={0.74}
                blur={12}
                textColor="#ffffff"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                idleIntensity={0.35}
                shineSize={10}
                shineFade={34}
                thickness={1.2}
                glow={1}
                followMouse={!isDispersing}
                proximity={250}
                onClick={handleStartTransition}
                disabled={isDispersing}
              >
                LET'S GO
              </SpecularButton>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
