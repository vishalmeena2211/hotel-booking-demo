import HeroSection from "@/components/hero-section"
import InfoSection from "@/components/info-section"
import NewsletterSection from "@/components/news-latter-section"

function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8">
                <HeroSection />
                <InfoSection />
                <NewsletterSection />
            </main>
        </div>
    )
}

export default HomePage
