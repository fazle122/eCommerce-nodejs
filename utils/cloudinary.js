import cloudinary from 'cloudinary'
import dotenv from 'dotenv'


// dotenv.config({path:'backend/.env'})
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SERET
})



export const upload_file = (file,folder) =>{
    return new Promise((resolve,reject) => {
         cloudinary.uploader.upload(file,(result) =>{
                resolve({
                    public_id:result.public_id,
                    url:result.url
                })    
            },
            {
                resource_type:"auto",
                folder
            }
         )
    })
}


export const delete_file = async (file) =>{
    const res = await cloudinary.uploader.destroy(file);

    if(res?.result === 'ok') return true;
}



// CastError: Cast to string failed for value "{
//     public_id: 'shopit/products/dnesm8himmbge8nsbqjr',
//     url: 'http://res.cloudinary.com/dkjr6shcp/image/upload/v1722403559/shopit/products/dnesm8himmbge8nsbqjr.jpg'
//     }" (type Object) at path "image"