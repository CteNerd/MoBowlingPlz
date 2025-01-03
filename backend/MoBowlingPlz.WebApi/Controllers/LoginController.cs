using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] LoginRequest loginRequest)
    {
        if (loginRequest.Username == "rtomlin62")
        {
            return Unauthorized();
        }
        else
        {
            return Ok();
        }
    }

    [HttpGet]
    [Route("health")]
    public IActionResult HealthCheck()
    {
        // Custom health check logic can be added here
        return Ok("Login Healthy");
    }
}

public record LoginRequest
{
    public string Username { get; init; }
    public string Password { get; init; }
}