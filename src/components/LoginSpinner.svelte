<script>
    //@ts-nocheck
    let class_ = "scale-[0.6]";

    export { class_ as class };
</script>

<div class={`loader ${class_}`}></div> 

<style>
.loader {
  width: 64px;
  height: 44px;
  position: relative;
  border: 5px solid #000; /* Changed to black for better contrast */
  border-radius: 8px;
}

.loader::before {
  content: '';
  position: absolute;
  border: 5px solid #000; /* Changed to black */
  width: 32px;
  height: 28px;
  border-radius: 50% 50% 0 0;
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
}

.loader::after {
  content: '';
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #000; /* Changed to black */
  box-shadow: 16px 0 #000, -16px 0 #000; /* Changed to black */
  animation: flash 0.5s ease-out infinite alternate;
}

@keyframes flash {
  0% {
    background-color: rgba(0, 0, 0, 0.25); /* Changed to semi-transparent black */
    box-shadow: 16px 0 rgba(0, 0, 0, 0.25), -16px 0 rgba(0, 0, 0, 1);
  }
  50% {
    background-color: rgba(0, 0, 0, 1); /* Solid black */
    box-shadow: 16px 0 rgba(0, 0, 0, 0.25), -16px 0 rgba(0, 0, 0, 0.25);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.25); /* Semi-transparent black */
    box-shadow: 16px 0 rgba(0, 0, 0, 1), -16px 0 rgba(0, 0, 0, 0.25);
  }
}

    
</style>