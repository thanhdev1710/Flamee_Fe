import './menubar.style.css'
function MenuBar() {
    return (
        <div className="menu-bar">
            <div className="logo">
                <img src="/assets/flamee.webp" alt="Flamee logo" />
                <span>Flamee</span>

            </div>

            <div className="right-menu">
                <div className='main-menu'>
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Events</a>
                    <a href="#">Blog</a>
                    <a href="#">Contact</a>
                </div>

                <div className="cta-menu">
                    <button className='cta-menu-item'>Sign in</button>
                    <button className='cta-menu-item active-menu'>Sign up</button>
                </div>
            </div>
        </div>
    );
}

export default MenuBar;