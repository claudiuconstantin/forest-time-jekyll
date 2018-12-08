# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "forest-time-jekyll"
  spec.version       = "0.1.3"
  spec.authors       = ["Claudiu Constantin"]
  spec.email         = ["claudiu@fastmail.com"]

  spec.summary       = "A simple theme for your static blog, fresh as a forest"
  spec.homepage      = "https://github.com/claudiuconstantin/forest-time-jekyll/"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 3.7"

  spec.add_development_dependency "bundler", "~> 1.17"
  spec.add_development_dependency "rake", "~> 12.3"
end
