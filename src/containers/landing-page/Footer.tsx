
function Footer() {
    return (
        <footer className="bg-[#1C2A50] text-white py-10">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-24">

                
                <div className="space-y-4 pr-8"> 
                    <div className="flex items-center space-x-2 text-blue-700 font-semibold text-xl">
                        <img src="/assets/images/logo.svg" alt="Flamee logo" className="h-6 w-6" />
                         <span>Flamee</span>
                    </div>


                    <div className="text-gray-300 text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                            <img src="/assets/location-logo.png" alt="Location icon" className="w-4 h-4" />
                            <span className="font-medium">Location</span>
                        </div>
                        <p>140 Lê Trọng Tấn, phường Tây Thạnh, quận Tân Phú, TP. Hồ Chí Minh</p>
                        <p>flamee123@gmail.com</p>
                        <p>0123456789</p>
                    </div>

                    <div className="flex space-x-5 pt-1">
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/128/4494/4494475.png" alt="Facebook" className="w-5 h-5" /></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/128/145/145807.png" alt="LinkedIn" className="w-5 h-5" /></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/128/2584/2584657.png" alt="Twitter" className="w-5 h-5" /></a>
                    </div>
                </div>

                
                <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-white">Product</h4>
                    <a href="#" className="block text-gray-300 hover:underline">Download</a>
                    <a href="#" className="block text-gray-300 hover:underline">Location</a>
                    <a href="#" className="block text-gray-300 hover:underline">Services</a>
                    <a href="#" className="block text-gray-300 hover:underline">Address</a>
                    <a href="#" className="block text-gray-300 hover:underline">Map</a>
                    <a href="#" className="block text-gray-300 hover:underline">Pricing</a>
                </div>

               
                <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-white">Community</h4>
                    <a href="#" className="block text-gray-300 hover:underline">Accessibility</a>
                    <a href="#" className="block text-gray-300 hover:underline">Frontline</a>
                    <a href="#" className="block text-gray-300 hover:underline">Gift</a>
                    <a href="#" className="block text-gray-300 hover:underline">Quest</a>
                    <a href="#" className="block text-gray-300 hover:underline">About us</a>
                    <a href="#" className="block text-gray-300 hover:underline">Contact</a>
                    <a href="#" className="block text-gray-300 hover:underline">Center</a>
                </div>

               
                <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-white">About</h4>
                    <a href="#" className="block text-gray-300 hover:underline">Investors</a>
                    <a href="#" className="block text-gray-300 hover:underline">Careers</a>
                    <a href="#" className="block text-gray-300 hover:underline">Founders</a>
                    <a href="#" className="block text-gray-300 hover:underline">Work</a>
                    <a href="#" className="block text-gray-300 hover:underline">Newsroom</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
