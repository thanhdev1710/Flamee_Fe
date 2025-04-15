import './socialmedia.style.css'

function SocialMedia() {
    return (
        <div className="social-media-section">
            <div className="title-section">
                <h1>Connect Social Media Accounts</h1>
                <p>A new social platform that helps you share moments, connect with friends, <br/>and explore the world in a whole new way.</p>

            </div>

            <div className="button-social">
                <button className='cta-button-social'>Get Start</button>
                <button className='cta-button-social default-button'>Learn more</button>
            </div>

            <div className='social-feature-img'>
                <img src="/assets/landing-page.webp" alt="socialmedia-feature-img" />
            </div>
        </div>
    );
}

export default SocialMedia;