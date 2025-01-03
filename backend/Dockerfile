# Dockerfile for Backend
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MoBowlingPlz.WebApi/*.csproj", "MoBowlingPlz.WebApi/"]
RUN ls MoBowlingPlz.WebApi
RUN dotnet restore "MoBowlingPlz.WebApi/MoBowlingPlz.WebApi.csproj"
COPY . .
WORKDIR "/src/MoBowlingPlz.WebApi"
RUN dotnet publish "MoBowlingPlz.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MoBowlingPlz.WebApi.dll"]