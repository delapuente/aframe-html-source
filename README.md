# aframe-html-source

An A-Frame component to display HTML inside an `<a-image>` primitive.

## Inspiration

## Install

Grab

## Usage

```html
<head>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://rawgit.com/delapuente/aframe-html-source/master/src/aframe-html-source.js"></script>
</head>
<body>
  <a-scene>
    <a-image html-src="#test" position="0 1.6 -1"></a-image>
  </a-scene>

  <section id="test">
    <p>
      A-Frame is a web framework for building virtual reality experiences. It
      was started by <a href="https://mozvr.com" target="_blank"
      rel="external">Mozilla VR</a> to make <a href="https://iswebvrready.com"
      target="_blank" rel="external">WebVR</a> content creation easier,
      faster, and more accessible.
    </p>
  </section>
</body>
```

## Limitations
