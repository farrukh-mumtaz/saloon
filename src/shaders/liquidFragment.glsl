precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uPreviousMouse;
uniform vec2 uVelocity;
uniform float uRadius;
uniform float uStrength;
uniform float uZoom;
uniform float uTime;
uniform float uHover;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

varying vec2 vUv;

// Cover UV calculation to ensure the texture behaves like object-fit: cover
vec2 getCoverUV(vec2 uv, vec2 imgRes, vec2 screenRes) {
    if (imgRes.x <= 0.0 || imgRes.y <= 0.0 || screenRes.x <= 0.0 || screenRes.y <= 0.0) {
        return uv;
    }
    float imgAspect = imgRes.x / imgRes.y;
    float screenAspect = screenRes.x / screenRes.y;
    vec2 outUv = uv;

    if (screenAspect > imgAspect) {
        float scale = screenAspect / imgAspect;
        outUv.y = (uv.y - 0.5) / scale + 0.5;
    } else {
        float scale = imgAspect / screenAspect;
        outUv.x = (uv.x - 0.5) / scale + 0.5;
    }

    return outUv;
}

void main() {
    // Aspect ratio correction for circular coordinates
    float aspect = uResolution.x / uResolution.y;
    vec2 aspectUV = vec2(vUv.x * aspect, vUv.y);
    vec2 aspectMouse = vec2(uMouse.x * aspect, uMouse.y);

    // Delta from mouse position in aspect space
    vec2 delta = aspectUV - aspectMouse;
    float dist = length(delta);

    // Velocity dynamics and directional bubble deformation
    float speed = length(uVelocity);
    vec2 velDir = speed > 0.0001 ? normalize(uVelocity) : vec2(0.0);
    
    // Stretch along direction of cursor movement (physical water balloon inertia)
    float deltaLen = max(dist, 0.0001);
    float velAlignment = dot(delta / deltaLen, velDir);
    float stretchFactor = 1.0 + clamp(speed * 4.5, 0.0, 0.9) * velAlignment;
    
    // Effective distance taking elongation into account
    float effectiveDist = dist / max(0.4, stretchFactor);

    // Organic liquid bubble profile:
    float normDist = clamp(effectiveDist / max(uRadius, 0.001), 0.0, 1.0);
    
    // Spherical dome height (convex lens surface)
    float domeHeight = sqrt(max(0.0, 1.0 - normDist * normDist));
    
    // Smooth organic falloff toward bubble boundary
    float falloff = smoothstep(1.0, 0.0, normDist);
    falloff = pow(falloff, 1.15); // Rich bell curve

    // Normalized radial direction in UV space
    vec2 uvDir = (dist > 0.0001) ? normalize(vUv - uMouse) : vec2(0.0);

    // DRAMATIC LIQUID LENS MAGNIFICATION:
    // A convex water lens bends rays inwards towards center, magnifying the imagery underneath by 35-50%
    float zoomAmount = uZoom * 1.6 * (0.6 + 0.6 * domeHeight);
    vec2 magnifyOffset = -uvDir * (falloff * zoomAmount * domeHeight);

    // DRAMATIC RADIAL BARREL BULGE:
    // Pushes image outward near the meniscus rim creating the physical water-balloon spherical curvature
    float bulgeFactor = sin(normDist * 3.14159265) * (uStrength * 0.42);
    vec2 bulgeOffset = uvDir * (falloff * bulgeFactor);

    // Water surface tension wave & subtle breathing micro-ripple
    float wave = sin(normDist * 14.0 - uTime * 3.0) * 0.015 * (1.0 - normDist) * falloff;
    
    // Fluid displacement along cursor velocity (water drag/sloshing inertia)
    vec2 dragOffset = -uVelocity * (falloff * 2.2 * uStrength);

    // Combined displacement modulated by hover transition state
    vec2 totalDisplacement = (magnifyOffset + bulgeOffset + uvDir * wave + dragOffset) * uHover;

    // Optical chromatic dispersion (subtle refraction separation at curved borders)
    float dispersion = 0.035 * falloff * uHover;
    vec2 rUV = vUv + totalDisplacement * (1.0 - dispersion * 1.3);
    vec2 gUV = vUv + totalDisplacement;
    vec2 bUV = vUv + totalDisplacement * (1.0 + dispersion * 1.6);

    // Sample texture with cover aspect ratio mapping
    vec2 finalR_UV = getCoverUV(clamp(rUV, 0.001, 0.999), uImageResolution, uResolution);
    vec2 finalG_UV = getCoverUV(clamp(gUV, 0.001, 0.999), uImageResolution, uResolution);
    vec2 finalB_UV = getCoverUV(clamp(bUV, 0.001, 0.999), uImageResolution, uResolution);

    float r = texture2D(uTexture, finalR_UV).r;
    float g = texture2D(uTexture, finalG_UV).g;
    float b = texture2D(uTexture, finalB_UV).b;

    vec3 color = vec3(r, g, b);

    // Physical liquid surface specular and fresnel sheen
    vec3 normal = normalize(vec3(-delta / max(uRadius, 0.001) * domeHeight, domeHeight + 0.12));
    vec3 lightDir = normalize(vec3(0.35, 0.65, 0.85));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);

    // Soft specular highlight on the curved liquid crown
    float spec = pow(max(0.0, dot(normal, halfVec)), 24.0) * falloff;
    
    // Rim reflection along the meniscus / droplet boundary
    float rim = smoothstep(0.70, 0.98, normDist) * (1.0 - smoothstep(0.98, 1.03, normDist));

    // Optical refraction sheen
    color += vec3(1.0, 0.98, 0.94) * (spec * 0.32 * uHover);
    color += vec3(0.85, 0.93, 1.0) * (rim * 0.22 * uHover);

    // Luminance enhancement inside clear water lens
    color = mix(color, color * 1.08, falloff * 0.4 * uHover);

    gl_FragColor = vec4(color, 1.0);
}
