function MenuBar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#f1f3ff] shadow-md">
      
   
      <div className="flex items-center space-x-2 text-blue-700 font-semibold text-xl">
        <img src="/assets/images/logo.svg" alt="Flamee logo" className="h-6 w-6" />
        <span>Flamee</span>
      </div>

     
      <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
        
        
        <div className="flex space-x-4 items-center">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Events</a>
          <a href="#" className="hover:text-blue-600">Blog</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>

     
        <div className="flex space-x-2">
          <a href="/auth/signin">
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100">
              Sign in
            </button>
          </a>
          <a href="/auth/signup">
            <button className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Sign up
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
