---
title : "Swapping out the radiator fan"
slug : "swapping-out-the-radiator-fan"
date : 2022-10-15T19:51:00.000Z
archives : ["2022", "2022/10"]
tags : ["cooling"]
images :

   -
       caption : "Measuring the input and output of the radiator"
       id : "52438258871"
       secret : "dac04cd8af"
       server : "65535"
       media : "photo"
       alt: "The windscreen of the B with chalk-pen numbers written on it showing the two measurements taken over time"
       marker : "01"

   -
       caption : "The original fan blade orientation"
       id : "52438259301"
       secret : "2fc94eb672"
       server : "65535"
       media : "photo"
       alt: "The fan's leading edge is thicker but the curve of the blade makes it seem like it will scoop air across the radiator front, rather than into it."
       marker : "02"

   -
       caption : "Radiator out to allow removal"
       id : "52438784073"
       secret : "6abacaa552"
       server : "65535"
       media : "photo"
       alt: "The engine bay looking towards the front of the car. The radiator is out and the fan can be seen in position."
       marker : "03"

   -
       caption : "Original Lucas Rists connector - this couldn't be re-used"
       id : "52438784393"
       secret : "2f1ebaed84"
       server : "65535"
       media : "photo"
       alt: "A faded white plastic moulding with two metal pins visible inside. The moulding is rectangular when viewed end-on, with one end tapering in."
       marker : "04"

   -
       caption : "Connector housing and pins. The barbs on the pins lock into the housing, so make sure you get a good connection with the wire."
       id : "52440332834"
       secret : "626937c866"
       server : "65535"
       media : "photo"
       alt: "The plastic housing with two long gold-coloured metal pins alongside. The pins have two barbs about halfway up."
       marker : "05"

   -
       caption : "New Lucas connector attached"
       id : "52461208551"
       secret : "fe07519832"
       server : "65535"
       media : "photo"
       alt: "Close-up of a new white plastic housing attached to the new motor wiring."
       marker : "06"

   -
       caption : "New motor"
       id : "52461661615"
       secret : "fe019317a0"
       server : "65535"
       media : "photo"
       alt: "The fan motor is a black cylinder with wires coming out the back and a shaft to take the fan blades sticking out the front."
       marker : "07"

   -
       caption : "Motor bracket"
       id : "52460691682"
       secret : "30225363ba"
       server : "65535"
       media : "photo"
       alt: "The bracket is in two halves. It is attached underneath the slam panel by the top half of the bracket with a half-circle curve to accept the motor. The second half completes the circle under the motor and bolts to the top half to allow adjustment of the motor position."
       marker : "08"

   -
       caption : "New fan in place - I readjusted it to be closer to the radiator after taking this"
       id : "52461209631"
       secret : "2b38768e35"
       server : "65535"
       media : "photo"
       alt: "The new fan in place against the radiator. The difference in orientation from the original is obvious with the curve now placed to scoop air through the radiator."
       marker : "09"
---

Cooling is the issue. Whlist the B has never overheated - a term characterised by plumes of steam - it has always run close to, or when in traffic actually in, the H zone of the temperature gauge. This has only ever meant it has bogged down somewhat when town driving as there isn't enough cooling air moving through the radiator. However it makes for less than relaxing drives, especially when this can even happen when doing anything under 40mph on country roads.

I started looking at exactly how hot the car was getting, taking measurements at the inlet and outlet of the radiator and how the fan manages to affect that temperature when it kicks in. What I found was that the fan was only maintaining the temperature of the radiator, but not reducing the temperature. That was an issue.

<div class="photoinsert">
//PH01
</div>

A discussion on the MGOC forum made me take a look at the orientation of the fan. The blades of the fan are not flat, they are curved but also thicker on one edge than the other, just like a plane wing. On all the technical drawings the fan is shown as it presented on the car - with the thick edge towards the radiator and the curve facing the way it wants to push air. But when inspecting the direction the fan moves in this doesn't make sense as it means the fan is not going to be working at full performance. More confusingly all the diagrams of this assembly in the manuals and parts catalogues also show it with the incorrect orientation. As the blade is bolted to the motor, it should be a matter of undoing the bolt and flipping the fan around. This would mean it would scoop the air into the radiator. But of course it is never that easy.

<div class="photoinsert">
//PH02
</div>

First issue was the bolt holding the blades to the motor had seized to the motor shaft, and then the head of the bolt sheared. This meant easy removal was out. The size of the assembly meant I'd need to remove the radiator to extract it. With the radiator out, thankfully the motor mounts didn't put up too much of a fight but on removal it was clear the fan and motor had become inseperable. 

<div class="photoinsert">
//PH03 //PH08
</div>

Time for new parts, including sourcing the rather unique Lucas connector which the new motor didn't come with. After a bit of searching I managed to find out this was called a [Lucas Rists 2-way moulded pin connector](https://www.3waycomponents.co.uk/product/lucas-rists-2-way-3mm-51150014-connector-kit/) and sourced a supplier. This connector's pins have barbs on them which lock into place inside the moulding which makes them non-reusable.

<div class="photoinsert">
//PH04 //PH05 //PH06
</div>

The new fan blades are eye-wateringly expensive - £45 for the pastic fan which is even more than the £38 motor it attaches to. So along with the new connectors and coolant refill this is not a cheap modification. Lots of copper grease was added to make sure if I needed to remove the blades in the future I could.

<div class="photoinsert">
//PH07 //PH09
</div>

I would have liked to have cleaned up the brackets holding the motor before putting the new one in, but the bolts holding it in were seized even after soaking in release fluid and I didn't want to end up with sheared heads and another job. I was thinking as I couldn't separate them, of reusing the old blades and motor as a second fan. This is something the V8 had fitted and so there were brackets available (though it would mean drilling the slam panel). So if I went down that route I'd tackle the state of the old bracket then.

With everything hooked up it was time for a test-run. Turning on the ignition and shorting out the temperature sender from the radiator - nothing. I hooked up the old fan (held in a vice to avoid hard-to-explain injury) and still nothing. Turns out I had a loose wire in the new connector and due to the barbs on the connector meaning it couldnt be reused, I ended up ordering a new one to make it good.

Second go and it worked. I needed the radiator back in to get the position of the fan correct, so the front grille was removed to allow access to the bolts, so I could leave the motor body slightly loose.

So with it now the correct way around, does it make any difference? I redid the tests, measuring the input and output temperature with an infared thermometer and it seemed like it was helping, but only a little. I certainly didn't see the drop in temperature I expected.

I'm happy I've done it as I know now this is correct (by physics if not the manual) and I have another fan for a future project. But I need to look elsewhere for the excessive heat issue.