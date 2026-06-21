{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    bun.enable = true;
    package = pkgs.nodejs_22;
  };

  packages = [
    pkgs.git
    pkgs.jq
    pkgs.ripgrep
  ];

  env.NODE_OPTIONS = "--max-old-space-size=4096";

  processes = {
    web.exec = "bun run dev";
    convex.exec = "bun convex dev";
  };

  scripts = {
    install.exec = "bun install --frozen-lockfile";
    dev.exec = "bun run dev";
    convex-dev.exec = "bun convex dev";
    check.exec = "bun run check";
    lint.exec = "bun run lint";
    test-unit.exec = "bun run test:unit";
    test-e2e.exec = "bun run test:e2e";
    build.exec = "bun run build";
    verify.exec = "bun run verify";
    setup.exec = ''
      bun install --frozen-lockfile
      if [ ! -f .env.local ]; then
        cp .env.example .env.local
        echo "Created .env.local from .env.example"
      fi
    '';
  };

  enterShell = ''
    echo ""
    echo "  Product Plate"
    echo "  -------------"
    echo "  Bun:  $(bun --version)"
    echo "  Node: $(node --version)"
    echo ""
    echo "  setup       Install dependencies and create .env.local"
    echo "  devenv up   Run SvelteKit and Convex together"
    echo "  dev          Run SvelteKit"
    echo "  convex-dev   Run Convex"
    echo "  verify       Lint, typecheck, test, and build"
    echo ""
  '';

  enterTest = ''
    bun --version
    node --version
    git --version
  '';
}
