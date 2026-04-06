import shutil, os

src1 = r"C:\Users\ASUS\.gemini\antigravity\brain\156151a9-a57d-4598-8dd3-c667cc1b4276\hair_before_crown_view_1775446333195.png"
src2 = r"C:\Users\ASUS\.gemini\antigravity\brain\156151a9-a57d-4598-8dd3-c667cc1b4276\hair_after_crown_view_1775446354584.png"
dst = r"C:\Users\ASUS\Desktop\LANDING PAGE"

shutil.copy(src1, os.path.join(dst, "before_hair.png"))
shutil.copy(src2, os.path.join(dst, "after_hair.png"))
print("OK: Files copied successfully")
