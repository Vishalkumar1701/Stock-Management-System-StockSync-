import React from 'react'

const Test = () => {
    return (
        <>
            <div className='bg-secondary-subtle' style={{ minHeight: '80vh' }} >
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <h4>Merchant Login :</h4>
                            <div>
                                <p> email : ramesh@gmail.com</p>
                                <p>password: ramesh1234</p>


                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <h4>Admin Login :</h4>
                            <div>
                                <p>email : vishal@gmail.com</p>
                                <p> password: vishal1234</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Test