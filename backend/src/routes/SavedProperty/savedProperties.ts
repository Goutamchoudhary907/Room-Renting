import express,{Request,Response} from "express"
import { PrismaClient } from "@prisma/client"
import { AuthenticatedRequest,authMiddleware } from "../../middleware/middleware"
const router=express.Router();
const prisma=new PrismaClient();

router.post("/user/:userId/save-property", authMiddleware,async(req:AuthenticatedRequest,res:Response) =>{
    const userId=parseInt(req.params.userId);
    const {propertyId}=req.body;

    if(!propertyId){
        res.status(400).json({message:"Missing propertyId in the request body."})
        return;
    }

    if(req.user?.userId !==userId){
        res.status(403).json({message: "Unauthorized to save properties for this user."})
        return;
    }

    try {
        const existingSaved = await prisma.savedProperty.findUnique({
            where: {
                unique_user_property: { 
                userId: userId,
                propertyId: parseInt(propertyId),
              },
            },
          });
          if (existingSaved) {
             res.status(200).json({ message: "Property already saved." }); 
             return
          }
          const savedProperty=await prisma.savedProperty.create({
            data:{
                userId:userId,
               propertyId:parseInt(propertyId)
            }
          })
          res.status(201).json({ message: "Property saved successfully.", savedPropertyId: savedProperty.id });
          return;
    } catch (error) {
        console.error("Error saving property:", error);
        res.status(500).json({ message: "Failed to save property." });
        return;
    }
})

router.delete("/user/:userId/unsave-property/:propertyId", authMiddleware , async(req: AuthenticatedRequest, res: Response) =>{
    const userId = parseInt(req.params.userId);
    const propertyId = parseInt(req.params.propertyId);
  
    if (req.user?.userId !== userId) {
       res.status(403).json({ message: "Unauthorized to unsave properties for this user." });
       return
    }
    try {
        const deletedSavedProperty = await prisma.savedProperty.delete({
          where: {
            unique_user_property: {
              userId: userId,
              propertyId: propertyId,
            },
          },
        });
    
        if (deletedSavedProperty) {
          res.json({ message: "Property unsaved successfully." });
        } else {
          res.status(404).json({ message: "Saved property not found." });
        }
      } catch (error) {
        console.error("Error unsaving property:", error);
        res.status(500).json({ message: "Failed to unsave property." });
      }
})

router.get("/user/:userId/saved-properties", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (req.user?.userId !== userId) {
     res.status(403).json({ message: "Unauthorized to access these saved properties." });
     return
  }

  try {
    const savedProperties = await prisma.savedProperty.findMany({
      where: {
        userId: userId,
      },
      select: {
        propertyId: true,
      },
    });
    res.json(savedProperties);
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    res.status(500).json({ message: "Failed to fetch saved properties." });
  }
});

export default router;