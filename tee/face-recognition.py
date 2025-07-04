from deepface import DeepFace

result = DeepFace.verify(img1_path = "img/1.jpg", img2_path = "img/2.jpg")

print(result)